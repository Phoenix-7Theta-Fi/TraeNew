import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getConnectedClient } from '@/lib/mongodb';
import { WithId, Document } from 'mongodb';
import type { YogaPracticeData, YogaResponse, YogaSunburstData, YogaQueryParams, YogaPracticeUpdateBody } from '@/types/yoga';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

// GET endpoint for retrieving yoga practice data
export async function GET(req: NextRequest) {
    try {
        // Extract authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Extract and verify token
        const token = authHeader.split(' ')[1];
        const decoded = verify(token, process.env.JWT_SECRET as string) as { userId: string };

        // Get query parameters
        const searchParams = req.nextUrl.searchParams;
        const view = searchParams.get('view') as YogaQueryParams['view'] || 'detailed';
        const timeframe = searchParams.get('timeframe') as YogaQueryParams['timeframe'] || 'all';
        const categoryId = searchParams.get('categoryId');

        // Connect to MongoDB
        const client = await getConnectedClient();
        const db = client.db('auth-db');

        let response: YogaResponse;

        if (view === 'sunburst') {
            // Fetch sunburst visualization data
            const sunburstData = await db.collection('yogaSunburstData').findOne(
                { userId: decoded.userId }
            );

            if (!sunburstData) {
                return NextResponse.json(
                    { success: false, error: 'Sunburst data not found' },
                    { status: 404 }
                );
            }

            response = {
                success: true,
                data: sunburstData.data as YogaSunburstData
            };
        } else {
            // Fetch detailed practice data
            const query: any = { userId: decoded.userId };
            if (categoryId) {
                query['categories.id'] = categoryId;
            }

            // Add timeframe filter if needed
            if (timeframe !== 'all') {
                const dateFilter = new Date();
                switch (timeframe) {
                    case 'week':
                        dateFilter.setDate(dateFilter.getDate() - 7);
                        break;
                    case 'month':
                        dateFilter.setMonth(dateFilter.getMonth() - 1);
                        break;
                    case 'year':
                        dateFilter.setFullYear(dateFilter.getFullYear() - 1);
                        break;
                }
                query.lastUpdated = { $gte: dateFilter };
            }

            const practiceData = await db.collection('yogaPractices').findOne<YogaPracticeData>(query);

            if (!practiceData) {
                return NextResponse.json(
                    { success: false, error: 'Practice data not found' },
                    { status: 404 }
                );
            }

            response = {
                success: true,
                data: practiceData
            };
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error fetching yoga data:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Function to recursively generate sunburst data
function generateSunburstDataFromPractice(category: any) {
    return {
        name: category.name,
        value: category.practiceTimeMinutes,
        children: category.subCategories.map((subCategory: any) => ({
            name: subCategory.name,
            value: subCategory.practiceTimeMinutes,
            children: subCategory.subCategories 
                ? subCategory.subCategories.map((subSubCategory: any) => ({
                    name: subSubCategory.name,
                    value: subSubCategory.practiceTimeMinutes,
                    children: subSubCategory.poses.map((pose: any) => ({
                        name: pose.name.english,
                        value: pose.practiceTimeMinutes
                    }))
                }))
                : subCategory.poses.map((pose: any) => ({
                    name: pose.name.english,
                    value: pose.practiceTimeMinutes
                }))
        }))
    };
}

// POST endpoint for updating practice frequencies
export async function POST(req: NextRequest) {
    try {
        // Extract authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Extract and verify token
        const token = authHeader.split(' ')[1];
        const decoded = verify(token, process.env.JWT_SECRET as string) as { userId: string };

        // Get request body
        const { poseId, categoryId, subCategoryId, subSubCategoryId } = await req.json() as YogaPracticeUpdateBody;

        if (!poseId || !categoryId || !subCategoryId) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const client = await getConnectedClient();
        const db = client.db('auth-db');

        // Prepare the base query
        const baseQuery: Record<string, any> = { 
            userId: decoded.userId,
            'categories.id': categoryId,
            'categories.subCategories.id': subCategoryId,
        };

        let updatePath: Record<string, number>;
        let arrayFilters: Record<string, any>[];

        if (subSubCategoryId) {
            // 4-level structure
            baseQuery['categories.subCategories.subCategories.id'] = subSubCategoryId;
            baseQuery['categories.subCategories.subCategories.poses.id'] = poseId;
            updatePath = {
                'categories.$[cat].subCategories.$[subCat].subCategories.$[subSubCat].poses.$[pose].frequency': 1,
                'categories.$[cat].practiceTimeMinutes': 1,
                'categories.$[cat].subCategories.$[subCat].practiceTimeMinutes': 1,
                'categories.$[cat].subCategories.$[subCat].subCategories.$[subSubCat].practiceTimeMinutes': 1,
                'categories.$[cat].subCategories.$[subCat].subCategories.$[subSubCat].poses.$[pose].practiceTimeMinutes': 1
            };
            arrayFilters = [
                { 'cat.id': categoryId },
                { 'subCat.id': subCategoryId },
                { 'subSubCat.id': subSubCategoryId },
                { 'pose.id': poseId }
            ];
        } else {
            // 3-level structure
            baseQuery['categories.subCategories.poses.id'] = poseId;
            updatePath = {
                'categories.$[cat].subCategories.$[subCat].poses.$[pose].frequency': 1,
                'categories.$[cat].practiceTimeMinutes': 1,
                'categories.$[cat].subCategories.$[subCat].practiceTimeMinutes': 1,
                'categories.$[cat].subCategories.$[subCat].poses.$[pose].practiceTimeMinutes': 1
            };
            arrayFilters = [
                { 'cat.id': categoryId },
                { 'subCat.id': subCategoryId },
                { 'pose.id': poseId }
            ];
        }

        // Update practice frequency and time
        const practiceResult = await db.collection('yogaPractices').updateOne(
            baseQuery,
            { 
                $inc: updatePath,
                $set: { lastUpdated: new Date() }
            },
            { arrayFilters }
        );

        // Update sunburst data
        const updatedPractice = await db.collection('yogaPractices').findOne<YogaPracticeData>(
            { userId: decoded.userId }
        );

        if (updatedPractice) {
            // Generate new sunburst data from updated practice data
            const newSunburstData = {
                name: 'Yoga Practice',
                children: updatedPractice.categories.map(generateSunburstDataFromPractice)
            };

            // Update sunburst collection
            await db.collection('yogaSunburstData').updateOne(
                { userId: decoded.userId },
                {
                    $set: {
                        data: newSunburstData,
                        lastUpdated: new Date()
                    }
                }
            );
        }

        if (practiceResult.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Yoga practice data not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating yoga practice:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
