import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const items = await prisma.product.findMany({
            where: {
                tenantId: user.tenant_id,
            },
        });

        return NextResponse.json(items);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const item = await prisma.product.create({
            data: {
                ...body,
                tenantId: user.tenant_id,
            },
        });

        return NextResponse.json(item);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
