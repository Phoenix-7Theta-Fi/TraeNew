const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkConnection() {
    if (!process.env.MONGODB_URI) {
        throw new Error('Missing MONGODB_URI environment variable');
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        console.log('✓ Successfully connected to MongoDB!');
        await client.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

checkConnection();
