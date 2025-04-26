require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function seedMedicationData() {
    if (!process.env.MONGODB_URI) {
        throw new Error('Please set MONGODB_URI environment variable');
    }

    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('auth-db');
        
        // Get existing users to associate data with
        const users = await db.collection('users').find({}).toArray();
        if (users.length === 0) {
            throw new Error('No users found in database');
        }

        // Clear existing medication collections
        await db.collection('herbUsage').deleteMany({});
        await db.collection('medicationSchedules').deleteMany({});
        await db.collection('treatments').deleteMany({});
        console.log('Cleared existing medication data');

        // Generate and insert data for each user
        for (const user of users) {
            await seedUserMedicationData(db, user._id);
        }

        console.log('Successfully seeded medication data');
        await client.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding medication data:', error);
        process.exit(1);
    }
}

async function seedUserMedicationData(db, userId) {
    const today = new Date();
    const herbList = ['Ashwagandha', 'Triphala', 'Brahmi', 'Turmeric'];
    const treatments = [
        {
            name: 'Ashwagandha',
            category: 'Herbs',
            description: 'Adaptogenic herb for stress reduction.'
        },
        {
            name: 'Panchakarma',
            category: 'Therapy',
            description: 'Intensive detoxification therapy.'
        },
        {
            name: 'Triphala',
            category: 'Herbs',
            description: 'Digestive tonic and cleanser.'
        },
        {
            name: 'Yoga Therapy',
            category: 'Exercise',
            description: 'Targeted yoga practices for dosha balance.'
        },
        {
            name: 'Dietary Cleanse',
            category: 'Diet',
            description: 'Focus on light, easily digestible foods.'
        }
    ];

    // Generate 30 days of herb usage data
    const herbUsageData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        return {
            userId: userId.toString(),
            date: date,
            herbs: Object.fromEntries(
                herbList.map(herb => [
                    herb,
                    Math.floor(Math.random() * 3) + 1 // 1-3 doses
                ])
            )
        };
    });

    // Generate 30 days of medication schedule data
    const scheduleData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        return {
            userId: userId.toString(),
            date: date,
            adherenceScore: Math.floor(Math.random() * 40) + 60, // 60-100
            medications: herbList.filter(() => Math.random() > 0.5)
        };
    });

    // Generate treatment data
    const treatmentData = treatments.map((treatment, index) => {
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 60));
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 15);

        return {
            userId: userId.toString(),
            ...treatment,
            startDate,
            endDate,
            status: startDate > today ? 'scheduled' : 
                   endDate < today ? 'completed' : 'ongoing'
        };
    });

    // Insert all data
    await Promise.all([
        db.collection('herbUsage').insertMany(herbUsageData),
        db.collection('medicationSchedules').insertMany(scheduleData),
        db.collection('treatments').insertMany(treatmentData)
    ]);

    console.log(`Seeded medication data for user: ${userId}`);
}

seedMedicationData();