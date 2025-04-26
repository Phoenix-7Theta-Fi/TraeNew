import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getConnectedClient } from '@/lib/mongodb';
import type { NutrientData, NutrientDataResponse } from '@/types/diet';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

export async function GET(req: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Extract and verify token
        const token = authHeader.split(' ')[1];
        const decoded = verify(token, process.env.JWT_SECRET as string) as { userId: string };

        // Get days parameter from query string (default to 30)
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '30');

        // Connect to MongoDB
        const client = await getConnectedClient();
        const db = client.db('auth-db');
        const nutrientData = db.collection('nutrientData');

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch nutrient data for the authenticated user
        const rawData = await nutrientData
            .find({
                userId: decoded.userId,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
            .sort({ date: 1 })
            .toArray();

        const data = rawData as unknown as NutrientData[];

        const response: NutrientDataResponse = {
            data,
            message: 'Nutrient data fetched successfully'
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching nutrient data:', error);
        if (error instanceof Error && error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
