import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const tables = await prisma.restaurantTable.findMany({
            where: { tenantId: user.tenant_id },
        });

        // Map to match the frontend expected format if needed
        const mappedTables = tables.map(t => ({
            restaurantTableId: t.id,
            tableNumber: t.tableNumber,
            capacity: t.capacity,
            status: t.status,
            posX: t.posX,
            posY: t.posY
        }));

        return NextResponse.json(mappedTables);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'Admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const table = await prisma.restaurantTable.create({
            data: {
                tenantId: user.tenant_id,
                tableNumber: body.tableNumber,
                capacity: body.capacity || 4,
                status: body.status || 'Available',
                posX: body.posX || 0,
                posY: body.posY || 0,
            },
        });
        return NextResponse.json(table);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
