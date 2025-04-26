const { MongoClient } = require('mongodb');
require('dotenv').config();

if (!process.env.MONGODB_URI) {
    throw new Error('Please set MONGODB_URI environment variable');
}

const mongoUri = process.env.MONGODB_URI;

function generateDoshaData(baseVata, basePitta, baseKapha) {
    // Generate sub-dosha values that correlate with their main doshas
    // but with some natural variation
    const variation = () => Math.floor(Math.random() * 20) - 10; // -10 to +10

    return {
        // Main doshas
        vata: baseVata + variation(),
        pitta: basePitta + variation(),
        kapha: baseKapha + variation(),
        // Sub-doshas (correlated with their main doshas)
        prana: baseVata + variation(),    // Vata sub-dosha
        samana: baseVata + variation(),   // Vata sub-dosha
        pachaka: basePitta + variation(), // Pitta sub-dosha
        sadhaka: basePitta + variation(), // Pitta sub-dosha
        avalambaka: baseKapha + variation() // Kapha sub-dosha
    };
}

async function seedDoshaData() {
    let client;

    try {
        client = await MongoClient.connect(mongoUri);
        const db = client.db('auth-db');
        console.log('Connected to MongoDB');

        // Get all users
        const users = await db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} users`);

        if (users.length === 0) {
            throw new Error('No users found in the database');
        }

        // Create dosha data for each user
        const doshaData = users.map(user => {
            // Generate base dosha values between 40-80
            const baseVata = Math.floor(Math.random() * 41) + 40;  // 40-80
            const basePitta = Math.floor(Math.random() * 41) + 40; // 40-80
            const baseKapha = Math.floor(Math.random() * 41) + 40; // 40-80

            return {
                userId: user._id.toString(),
                ...generateDoshaData(baseVata, basePitta, baseKapha),
                updatedAt: new Date()
            };
        });

        // Clear existing dosha data
        await db.collection('doshaBalances').deleteMany({});

        // Insert new dosha data
        await db.collection('doshaBalances').insertMany(doshaData);

        console.log(`Successfully seeded dosha data for ${users.length} users`);
    } catch (error) {
        console.error('Error seeding dosha data:', error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

// Run the seeding
seedDoshaData();
