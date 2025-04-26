import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { getConnectedClient } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

        // Connect to MongoDB
        const client = await getConnectedClient();
        const db = client.db('auth-db');
        const users = db.collection('users');

        // Find user by ID
        const user = await users.findOne({ 
            _id: new ObjectId(decoded.userId)
        });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Remove password from response
        const { password, ...userData } = user;

        return NextResponse.json({
            user: {
                ...userData,
                _id: userData._id.toString()
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        if (error instanceof Error && error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
