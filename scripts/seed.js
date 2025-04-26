require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function seedUsers() {
    if (!process.env.MONGODB_URI) {
        throw new Error('Please set MONGODB_URI environment variable');
    }

    try {
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('auth-db');
        const users = db.collection('users');

        // Clear existing users
        await users.deleteMany({});
        console.log('Cleared existing users');

        const hashedPassword = await bcrypt.hash('harsha', 10);
        const currentTime = new Date();

        const mockUsers = [
            { name: 'John Smith', email: 'john@tangerine.com', password: hashedPassword, createdAt: currentTime, updatedAt: currentTime },
            { name: 'Emma Davis', email: 'emma@tangerine.com', password: hashedPassword, createdAt: currentTime, updatedAt: currentTime },
            { name: 'Michael Wilson', email: 'michael@tangerine.com', password: hashedPassword, createdAt: currentTime, updatedAt: currentTime },
            { name: 'Sarah Brown', email: 'sarah@tangerine.com', password: hashedPassword, createdAt: currentTime, updatedAt: currentTime },
            { name: 'James Anderson', email: 'james@tangerine.com', password: hashedPassword, createdAt: currentTime, updatedAt: currentTime },
            { name: 'Lisa Taylor', email: 'lisa@tangerine.com', password: hashedPassword, createdAt: currentTime, updatedAt: currentTime },
            { name: 'David Moore', email: 'david@tangerine.com', password: hashedPassword, createdAt: currentTime, updatedAt: currentTime },
            { name: 'Emily White', email: 'emily@tangerine.com', password: hashedPassword, createdAt: currentTime, updatedAt: currentTime },
            { name: 'Robert Martin', email: 'robert@tangerine.com', password: hashedPassword, createdAt: currentTime, updatedAt: currentTime },
            { name: 'Jessica Lee', email: 'jessica@tangerine.com', password: hashedPassword, createdAt: currentTime, updatedAt: currentTime }
        ];

        const result = await users.insertMany(mockUsers);
        console.log(`Successfully seeded ${result.insertedCount} users`);

        await client.close();
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

seedUsers();
