import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const notifications = await prisma.notification.findMany({
            where: {
                tenantId: user.tenant_id,
                OR: [
                    { targetRole: user.role },
                    { targetUserId: user.sub },
                    { targetRole: 'All' }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return NextResponse.json(notifications);
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
        const notification = await prisma.notification.create({
            data: {
                tenantId: user.tenant_id,
                targetRole: body.targetRole || 'All',
                targetUserId: body.targetUserId,
                message: body.message,
                type: body.type || 'General',
                orderId: body.orderId
            },
        });
        return NextResponse.json(notification);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
