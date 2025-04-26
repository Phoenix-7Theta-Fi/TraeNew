import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getConnectedClient } from '@/lib/mongodb';
import { Treatment, TreatmentResponse } from '@/types/medication';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

export async function GET(req: NextRequest): Promise<NextResponse<TreatmentResponse>> {
    try {
        // Get the authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                success: false,
                error: 'Unauthorized',
                data: []
            } as TreatmentResponse, { status: 401 });
        }

        // Extract and verify token
        const token = authHeader.split(' ')[1];
        const decoded = verify(token, process.env.JWT_SECRET as string) as { userId: string };

        // Connect to MongoDB
        const client = await getConnectedClient();
        const db = client.db('auth-db');

        // Get query parameters
        const url = new URL(req.url);
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        // Build query
        let query: any = { userId: decoded.userId };
        if (startDate || endDate) {
            query.startDate = {};
            if (startDate) query.startDate.$gte = new Date(startDate);
            if (endDate) query.startDate.$lte = new Date(endDate);
        }

        const treatments = await db
            .collection('treatments')
            .find(query)
            .sort({ startDate: 1 })
            .toArray();

        // Transform MongoDB documents to Treatment type
        const typedTreatments: Treatment[] = treatments.map(doc => ({
            userId: doc.userId,
            name: doc.name,
            category: doc.category,
            description: doc.description,
            startDate: doc.startDate,
            endDate: doc.endDate,
            status: doc.status
        }));

        return NextResponse.json({
            success: true,
            data: typedTreatments
        });

    } catch (error) {
        console.error('Error fetching treatments:', error);
        if (error instanceof Error && error.name === 'JsonWebTokenError') {
            return NextResponse.json({
                success: false,
                error: 'Invalid token',
                data: []
            } as TreatmentResponse, { status: 401 });
        }
        return NextResponse.json(
            { 
                success: false,
                error: 'Internal server error',
                data: []
            } as TreatmentResponse,
            { status: 500 }
        );
    }
}
