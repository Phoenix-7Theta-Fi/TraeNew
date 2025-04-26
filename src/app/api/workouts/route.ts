import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getConnectedClient } from '@/lib/mongodb';
import type { WorkoutResponse, WorkoutDocument } from '@/types/workout';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                success: false,
                error: 'Unauthorized'
            } as WorkoutResponse, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const userId = decoded.userId;

        const client = await getConnectedClient();
        const db = client.db('auth-db');

        const workoutData = await db
            .collection('workouts')
            .findOne({ userId });

        if (!workoutData) {
            return NextResponse.json({
                success: false,
                error: 'No workout data found'
            } as WorkoutResponse, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: workoutData
        } as WorkoutResponse);

    } catch (error) {
        console.error('Error in workouts API:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        } as WorkoutResponse, { status: 500 });
    }
}
