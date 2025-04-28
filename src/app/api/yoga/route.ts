import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getConnectedClient } from '@/lib/mongodb';
import { WithId, Document } from 'mongodb';
import type { YogaPracticeData, YogaResponse } from '@/types/yoga';

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

        // Connect to MongoDB
        const client = await getConnectedClient();
        const db = client.db('auth-db');

        // Get the view parameter from the URL
        const url = new URL(req.url);
        const view = url.searchParams.get('view');

        if (view === 'sunburst') {
            // Fetch sunburst data from the dedicated collection
            const sunburstData = await db.collection('yogaSunburstData')
                .findOne({ userId: decoded.userId });

            if (!sunburstData) {
                return NextResponse.json({
                    success: false,
                    error: 'No sunburst data found'
                });
            }

            return NextResponse.json({
                success: true,
                data: sunburstData.data
            });
        }

        // Default: Fetch yoga practices for timeline view
        const practices = await db.collection('yogaPractices')
            .find({ userId: decoded.userId })
            .sort({ date: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            practices: practices.map(practice => ({
                id: practice._id.toString(),
                date: practice.date,
                type: practice.type,
                typeName: practice.typeName,
                duration: practice.duration,
                intensity: practice.intensity,
                focus: practice.focus,
                props: practice.props,
                color: practice.color
            }))
        });

    } catch (error) {
        console.error('Error in yoga GET route:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
