require('dotenv').config();
const { MongoClient } = require('mongodb');

// Helper function to generate random number within range
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate one day of nutrient data
function generateDailyNutrients() {
    return {
        proteins: randomInRange(40, 120),
        carbs: randomInRange(150, 350),
        fats: randomInRange(30, 80),
        vitaminC: randomInRange(50, 150),
        calcium: randomInRange(800, 1200),
        iron: randomInRange(10, 20)
    };
}

async function seedDietData() {
    if (!process.env.MONGODB_URI) {
        throw new Error('Please set MONGODB_URI environment variable');
    }

    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('auth-db');
        const users = db.collection('users');
        const nutrientData = db.collection('nutrientData');

        // Clear existing nutrient data
        await nutrientData.deleteMany({});
        console.log('Cleared existing nutrient data');

        // Get all users
        const existingUsers = await users.find({}).toArray();
        console.log(`Found ${existingUsers.length} users`);

        // Generate 30 days of data for each user
        const allNutrientData = [];
        const today = new Date();

        for (const user of existingUsers) {
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                
                allNutrientData.push({
                    userId: user._id.toString(),
                    date: date,
                    nutrients: generateDailyNutrients()
                });
            }
        }

        // Insert all nutrient data
        if (allNutrientData.length > 0) {
            const result = await nutrientData.insertMany(allNutrientData);
            console.log(`Successfully seeded ${result.insertedCount} nutrient records`);
        }

        await client.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding nutrient data:', error);
        process.exit(1);
    }
}

seedDietData();
