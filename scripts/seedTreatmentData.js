require('dotenv').config();
const { MongoClient } = require('mongodb');

// Helper function to generate treatment data for a user
function generateUserTreatments(userId) {
    const now = new Date();
    return [
        {
            userId,
            name: "Panchakarma Therapy",
            category: "Therapy",
            description: "Traditional Ayurvedic cleansing and rejuvenation program",
            startDate: new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000)), // 14 days ago
            endDate: new Date(now.getTime() - (1 * 24 * 60 * 60 * 1000)),    // yesterday
            status: "completed"
        },
        {
            userId,
            name: "Triphala Herbs",
            category: "Herbs",
            description: "Daily Triphala supplement for digestive health",
            startDate: new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000)),  // 5 days ago
            endDate: new Date(now.getTime() + (25 * 24 * 60 * 60 * 1000)),   // 25 days from now
            status: "ongoing"
        },
        {
            userId,
            name: "Yoga Practice",
            category: "Exercise",
            description: "Daily morning yoga routine focusing on flexibility and strength",
            startDate: new Date(),  // today
            endDate: new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)),   // 30 days from now
            status: "ongoing"
        },
        {
            userId,
            name: "Pitta Diet Plan",
            category: "Diet",
            description: "Customized diet plan to balance Pitta dosha",
            startDate: new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000)),  // 5 days from now
            endDate: new Date(now.getTime() + (35 * 24 * 60 * 60 * 1000)),   // 35 days from now
            status: "scheduled"
        },
        {
            userId,
            name: "Ashwagandha Protocol",
            category: "Herbs",
            description: "Evening Ashwagandha supplement for stress relief",
            startDate: new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)), // 10 days from now
            endDate: new Date(now.getTime() + (40 * 24 * 60 * 60 * 1000)),   // 40 days from now
            status: "scheduled"
        }
    ];
}

async function seedTreatments() {
    if (!process.env.MONGODB_URI) {
        throw new Error('Please set MONGODB_URI environment variable');
    }

    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('auth-db');
        const users = db.collection('users');
        const treatments = db.collection('treatments');

        // Clear existing treatments
        await treatments.deleteMany({});
        console.log('Cleared existing treatments');

        // Get all users
        const existingUsers = await users.find({}).toArray();
        console.log(`Found ${existingUsers.length} users`);

        // Generate treatments for each user
        const allTreatments = existingUsers.flatMap(user => 
            generateUserTreatments(user._id.toString())
        );

        // Insert all treatments
        if (allTreatments.length > 0) {
            const result = await treatments.insertMany(allTreatments);
            console.log(`Successfully seeded ${result.insertedCount} treatment records`);
        }

        await client.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding treatments:', error);
        process.exit(1);
    }
}

seedTreatments();
