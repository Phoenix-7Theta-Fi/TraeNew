const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const generateHeartRateZones = (avgHR) => {
    return [
        { zone: 1, minutes: Math.floor(Math.random() * 15), minHR: avgHR - 50, maxHR: avgHR - 30 },
        { zone: 2, minutes: Math.floor(Math.random() * 20), minHR: avgHR - 30, maxHR: avgHR - 10 },
        { zone: 3, minutes: Math.floor(Math.random() * 25), minHR: avgHR - 10, maxHR: avgHR + 10 },
        { zone: 4, minutes: Math.floor(Math.random() * 15), minHR: avgHR + 10, maxHR: avgHR + 30 },
        { zone: 5, minutes: Math.floor(Math.random() * 10), minHR: avgHR + 30, maxHR: avgHR + 50 }
    ];
};

const generateCardioSessions = (numSessions) => {
    const activities = ['running', 'cycling', 'swimming', 'rowing'];
    const sessions = [];
    const today = new Date();

    for (let i = 0; i < numSessions; i++) {
        const avgHR = Math.floor(Math.random() * 40) + 130; // Random HR between 130-170
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const distance = Math.floor(Math.random() * 8000) + 2000; // 2-10km in meters
        const duration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes

        sessions.push({
            date: new Date(today.getTime() - (i * 24 * 60 * 60 * 1000)), // One session per day going back
            activity,
            duration,
            distance,
            averageHeartRate: avgHR,
            maxHeartRate: avgHR + Math.floor(Math.random() * 20),
            zones: generateHeartRateZones(avgHR),
            averagePace: Math.floor((duration * 60) / (distance / 1000)) // seconds per kilometer
        });
    }
    return sessions;
};

const generateFitnessMetrics = (base = 50) => {
    return {
        strength: Math.min(100, base + Math.floor(Math.random() * 30)),
        endurance: Math.min(100, base + Math.floor(Math.random() * 30)),
        flexibility: Math.min(100, base + Math.floor(Math.random() * 30)),
        power: Math.min(100, base + Math.floor(Math.random() * 30)),
        balance: Math.min(100, base + Math.floor(Math.random() * 30)),
        coreStability: Math.min(100, base + Math.floor(Math.random() * 30)),
        recoveryRate: Math.min(100, base + Math.floor(Math.random() * 30)),
        vo2Max: Math.min(100, base + Math.floor(Math.random() * 30))
    };
};

async function seedWorkoutData() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('auth-db');
        const users = await db.collection('users').find({}).toArray();
        const workoutsCollection = db.collection('workouts');

        // Clear existing workout data
        await workoutsCollection.deleteMany({});

        for (const user of users) {
            const workoutDoc = {
                userId: user._id.toString(),  // Use the MongoDB _id as userId
                fitnessMetrics: {
                    current: generateFitnessMetrics(40), // Current metrics start lower
                    target: generateFitnessMetrics(70)   // Target metrics start higher
                },
                cardioSessions: generateCardioSessions(14), // Two weeks of sessions
                createdAt: new Date(),
                updatedAt: new Date()
            };

            await workoutsCollection.insertOne(workoutDoc);
            console.log(`Created workout data for user: ${user.email}`);
        }

        console.log('Workout data seeding completed');
    } catch (error) {
        console.error('Error seeding workout data:', error);
    } finally {
        await client.close();
    }
}

seedWorkoutData();
