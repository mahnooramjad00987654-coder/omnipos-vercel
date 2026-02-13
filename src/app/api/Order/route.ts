import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            where: {
                tenantId: user.tenant_id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(orders);
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
        const order = await prisma.order.create({
            data: {
                ...body,
                tenantId: user.tenant_id,
                items: {
                    create: body.items,
                },
            },
        });

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
