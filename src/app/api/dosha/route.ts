import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getConnectedClient } from '@/lib/mongodb';
import { DoshaData } from '@/types/medication';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

export async function GET(request: NextRequest) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const userId = decoded.userId;

        const client = await getConnectedClient();
        const db = client.db('auth-db');

        // Get dosha data for the user
        const doshaData = await db.collection('doshaBalances').findOne(
            { userId }
        );

        if (!doshaData) {
            return NextResponse.json(
                { error: 'Dosha data not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                vata: doshaData.vata,
                pitta: doshaData.pitta,
                kapha: doshaData.kapha,
                prana: doshaData.prana,
                samana: doshaData.samana,
                pachaka: doshaData.pachaka,
                sadhaka: doshaData.sadhaka,
                avalambaka: doshaData.avalambaka
            } as DoshaData
        });
    } catch (error) {
        console.error('Error fetching dosha data:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
