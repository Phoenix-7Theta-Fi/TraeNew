const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

// Enhanced yoga data structure with more categories, sublevels and detailed practice information
const yogaCategories = [
    {
        name: 'Hatha',
        description: 'Traditional form focusing on posture and breath control',
        practiceTimeMinutes: 800,
        subCategories: [
            {
                name: 'Strength',
                description: 'Poses that build strength and stability',
                practiceTimeMinutes: 400,
                subCategories: [
                    {
                        name: 'Upper Body',
                        description: 'Poses focusing on arm and shoulder strength',
                        practiceTimeMinutes: 200,
                        poses: [
                            {
                                name: { sanskrit: 'Chaturanga Dandasana', english: 'Four-Limbed Staff Pose' },
                                difficulty: 'intermediate',
                                durationInSeconds: 120,
                                benefits: ['Builds upper body strength', 'Strengthens core', 'Improves posture'],
                                frequency: 0,
                                practiceTimeMinutes: 100
                            },
                            {
                                name: { sanskrit: 'Phalakasana', english: 'Plank Pose' },
                                difficulty: 'beginner',
                                durationInSeconds: 90,
                                benefits: ['Strengthens arms', 'Builds core stability', 'Improves balance'],
                                frequency: 0,
                                practiceTimeMinutes: 100
                            }
                        ]
                    },
                    {
                        name: 'Core',
                        description: 'Poses targeting abdominal and core strength',
                        practiceTimeMinutes: 200,
                        poses: [
                            {
                                name: { sanskrit: 'Navasana', english: 'Boat Pose' },
                                difficulty: 'intermediate',
                                durationInSeconds: 90,
                                benefits: ['Strengthens core', 'Improves balance', 'Builds focus'],
                                frequency: 0,
                                practiceTimeMinutes: 100
                            },
                            {
                                name: { sanskrit: 'Ardha Navasana', english: 'Half Boat Pose' },
                                difficulty: 'beginner',
                                durationInSeconds: 60,
                                benefits: ['Strengthens lower abdomen', 'Improves core stability', 'Enhances focus'],
                                frequency: 0,
                                practiceTimeMinutes: 100
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Flexibility',
                description: 'Poses that enhance flexibility',
                practiceTimeMinutes: 400,
                subCategories: [
                    {
                        name: 'Spine',
                        description: 'Poses focusing on spinal mobility',
                        practiceTimeMinutes: 200,
                        poses: [
                            {
                                name: { sanskrit: 'Uttanasana', english: 'Forward Fold' },
                                difficulty: 'beginner',
                                durationInSeconds: 60,
                                benefits: ['Stretches spine', 'Calms mind', 'Relieves stress'],
                                frequency: 0,
                                practiceTimeMinutes: 100
                            },
                            {
                                name: { sanskrit: 'Matsyendrasana', english: 'Seated Twist' },
                                difficulty: 'intermediate',
                                durationInSeconds: 90,
                                benefits: ['Improves spinal mobility', 'Aids digestion', 'Releases tension'],
                                frequency: 0,
                                practiceTimeMinutes: 100
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'Vinyasa',
        description: 'Dynamic practice synchronizing breath with movement',
        practiceTimeMinutes: 600,
        subCategories: [
            {
                name: 'Balance',
                description: 'Dynamic balance poses',
                practiceTimeMinutes: 300,
                subCategories: [
                    {
                        name: 'Standing Poses',
                        description: 'Balance poses performed from standing position',
                        practiceTimeMinutes: 150,
                        poses: [
                            {
                                name: { sanskrit: 'Vrksasana', english: 'Tree Pose' },
                                difficulty: 'beginner',
                                durationInSeconds: 60,
                                benefits: ['Improves balance', 'Strengthens legs', 'Enhances focus'],
                                frequency: 0,
                                practiceTimeMinutes: 75
                            },
                            {
                                name: { sanskrit: 'Virabhadrasana', english: 'Warrior Series' },
                                difficulty: 'intermediate',
                                durationInSeconds: 120,
                                benefits: ['Builds strength', 'Improves stability', 'Enhances focus'],
                                frequency: 0,
                                practiceTimeMinutes: 75
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: 'Yin',
        description: 'Slow-paced style holding poses for longer periods',
        practiceTimeMinutes: 400,
        subCategories: [
            {
                name: 'Recovery',
                description: 'Restorative poses for deep relaxation',
                practiceTimeMinutes: 200,
                subCategories: [
                    {
                        name: 'Joints',
                        description: 'Poses targeting joint mobility and health',
                        practiceTimeMinutes: 100,
                        poses: [
                            {
                                name: { sanskrit: 'Baddha Konasana', english: 'Hip Opener' },
                                difficulty: 'beginner',
                                durationInSeconds: 300,
                                benefits: ['Opens hips', 'Releases tension', 'Promotes relaxation'],
                                frequency: 0,
                                practiceTimeMinutes: 50
                            },
                            {
                                name: { sanskrit: 'Garudasana', english: 'Shoulder Release' },
                                difficulty: 'intermediate',
                                durationInSeconds: 240,
                                benefits: ['Relieves shoulder tension', 'Improves posture', 'Enhances focus'],
                                frequency: 0,
                                practiceTimeMinutes: 50
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

// Enhanced function to handle the new 4-level data structure
function generateSunburstData(categories) {
    return {
        name: 'Yoga Practice',
        children: categories.map(category => ({
            name: category.name,
            value: category.practiceTimeMinutes,
            children: category.subCategories.map(subCategory => ({
                name: subCategory.name,
                value: subCategory.practiceTimeMinutes,
                children: subCategory.subCategories ? subCategory.subCategories.map(subSubCategory => ({
                    name: subSubCategory.name,
                    value: subSubCategory.practiceTimeMinutes,
                    children: subSubCategory.poses.map(pose => ({
                        name: pose.name.english,
                        value: pose.practiceTimeMinutes
                    }))
                })) : subCategory.poses.map(pose => ({
                    name: pose.name.english,
                    value: pose.practiceTimeMinutes
                }))
            }))
        }))
    };
}

// Enhanced function to generate random frequencies
function generateRandomFrequencies(poses) {
    return poses.map(pose => ({
        ...pose,
        id: new ObjectId().toString(),
        frequency: Math.floor(Math.random() * 20)
    }));
}

// Enhanced function to process categories and add IDs
function processCategories(categories) {
    return categories.map(category => ({
        ...category,
        id: new ObjectId().toString(),
        subCategories: category.subCategories.map(subCategory => ({
            ...subCategory,
            id: new ObjectId().toString(),
            subCategories: subCategory.subCategories ? subCategory.subCategories.map(subSubCategory => ({
                ...subSubCategory,
                id: new ObjectId().toString(),
                poses: generateRandomFrequencies(subSubCategory.poses)
            })) : undefined,
            poses: subCategory.poses ? generateRandomFrequencies(subCategory.poses) : undefined
        }))
    }));
}

async function seedYogaData() {
    let client;

    try {
        client = await MongoClient.connect(mongoUri);
        const db = client.db('auth-db');

        // Get all users
        const users = await db.collection('users').find({}).toArray();

        // Create collections if they don't exist
        await db.createCollection('yogaPractices');
        await db.createCollection('yogaSunburstData');

        // Clear existing data
        await db.collection('yogaPractices').deleteMany({});
        await db.collection('yogaSunburstData').deleteMany({});

        // Create yoga practice data for each user
        for (const user of users) {
            const processedCategories = processCategories(yogaCategories);
            
            // Store detailed practice data
            const yogaData = {
                userId: user._id.toString(),
                categories: processedCategories,
                lastUpdated: new Date()
            };

            // Store sunburst visualization data
            const sunburstData = {
                userId: user._id.toString(),
                data: generateSunburstData(processedCategories),
                lastUpdated: new Date()
            };

            // Insert or update yoga data for user
            await db.collection('yogaPractices').updateOne(
                { userId: user._id.toString() },
                { $set: yogaData },
                { upsert: true }
            );

            // Insert or update sunburst data for user
            await db.collection('yogaSunburstData').updateOne(
                { userId: user._id.toString() },
                { $set: sunburstData },
                { upsert: true }
            );

            console.log(`Created yoga practice and sunburst data for user: ${user._id}`);
        }

        console.log('Yoga data seeding completed successfully');
    } catch (error) {
        console.error('Error seeding yoga data:', error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

// Run the seed function
seedYogaData();
