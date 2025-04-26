import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getConnectedClient } from '@/lib/mongodb';
import type { 
    HerbUsageResponse, 
    MedicationScheduleResponse, 
    TreatmentResponse,
    DateRangeRequest 
} from '@/types/medication';

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

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'herbs', 'schedule', or 'treatments'
        const days = parseInt(searchParams.get('days') || '30');

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Connect to MongoDB
        const client = await getConnectedClient();
        const db = client.db('auth-db');

        let response;

        switch (type) {
            case 'herbs':
                const herbData = await db.collection('herbUsage')
                    .find({
                        userId: decoded.userId,
                        date: { $gte: startDate, $lte: endDate }
                    })
                    .sort({ date: 1 })
                    .toArray();

                response = {
                    success: true,
                    data: herbData
                } as HerbUsageResponse;
                break;

            case 'schedule':
                const scheduleData = await db.collection('medicationSchedules')
                    .find({
                        userId: decoded.userId,
                        date: { $gte: startDate, $lte: endDate }
                    })
                    .sort({ date: 1 })
                    .toArray();

                response = {
                    success: true,
                    data: scheduleData
                } as MedicationScheduleResponse;
                break;

            case 'treatments':
                const treatmentData = await db.collection('treatments')
                    .find({
                        userId: decoded.userId,
                        $or: [
                            { status: 'ongoing' },
                            { 
                                endDate: { $gte: startDate },
                                status: 'completed'
                            },
                            {
                                startDate: { $lte: endDate },
                                status: 'scheduled'
                            }
                        ]
                    })
                    .toArray();

                response = {
                    success: true,
                    data: treatmentData
                } as TreatmentResponse;
                break;

            default:
                return NextResponse.json(
                    { error: 'Invalid type parameter' },
                    { status: 400 }
                );
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error fetching medication data:', error);
        if (error instanceof Error && error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}