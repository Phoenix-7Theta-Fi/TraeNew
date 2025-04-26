import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { getConnectedClient } from '@/lib/mongodb';
import type { LoginCredentials, UserResponse } from '@/types/user';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

export async function POST(request: NextRequest) {
    try {
        const { email, password }: LoginCredentials = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const client = await getConnectedClient();
        const db = client.db('auth-db');

        // Find user
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        const response: UserResponse = {
            user: {
                _id: user._id.toString(),
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
