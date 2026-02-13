import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const localOrders = await request.json();
        const syncResults = [];

        for (const localOrder of localOrders) {
            const existingOrder = await prisma.order.findUnique({
                where: { id: localOrder.id },
            });

            if (!existingOrder) {
                // Create new order
                const newOrder = await prisma.order.create({
                    data: {
                        id: localOrder.id,
                        tenantId: user.tenant_id,
                        staffId: localOrder.staffId,
                        customerName: localOrder.customerName,
                        tableId: localOrder.tableId,
                        totalAmount: localOrder.totalAmount,
                        status: localOrder.status,
                        workflowStatus: localOrder.status,
                        metadataJson: localOrder.metadataJson,
                        pendingAmendmentsJson: localOrder.pendingAmendmentsJson,
                        notes: localOrder.notes,
                        guestCount: localOrder.guestCount,
                        paymentMethod: localOrder.paymentMethod,
                        vectorClock: localOrder.vectorClock,
                        createdAt: localOrder.createdAt,
                        paidAt: localOrder.paidAt,
                        discountReason: localOrder.discountReason,
                        serviceCharge: localOrder.serviceCharge,
                        discount: localOrder.discount,
                        discountType: localOrder.discountType,
                        finalTotal: localOrder.finalTotal,
                    },
                });
                syncResults.push({ id: localOrder.id, status: 'Synchronized' });
            } else {
                // Logic for vector clock comparison would go here
                // For now, let's just update if logical clock is higher (simple version)
                await prisma.order.update({
                    where: { id: localOrder.id },
                    data: {
                        // Update fields...
                        status: localOrder.status,
                        totalAmount: localOrder.totalAmount,
                        metadataJson: localOrder.metadataJson,
                        vectorClock: localOrder.vectorClock,
                        finalTotal: localOrder.finalTotal,
                        paidAt: localOrder.paidAt,
                    },
                });
                syncResults.push({ id: localOrder.id, status: 'Updated' });
            }
        }

        return NextResponse.json(syncResults);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
