import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const staff = await prisma.staff.findUnique({
            where: { username },
        });

        if (!staff) {
            return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, staff.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET || 'a_very_secure_and_long_secret_key_for_omnipos_2026'
        );

        const token = await new SignJWT({
            sub: staff.id,
            role: staff.role,
            tenant_id: staff.tenantId,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setIssuer('OmniPOS')
            .setAudience('OmniPOS')
            .setExpirationTime('7d')
            .sign(secret);

        return NextResponse.json({
            token,
            user: {
                id: staff.id,
                fullName: staff.fullName,
                role: staff.role,
                tenantId: staff.tenantId,
            },
        });
    } catch (error: any) {
        console.error('[AUTH_ERROR]', error);
        return NextResponse.json({ message: 'Server Error: ' + error.message }, { status: 500 });
    }
}
