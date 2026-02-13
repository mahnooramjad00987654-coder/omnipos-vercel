import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const staff = await prisma.staff.findMany({
            where: { tenantId: user.tenant_id },
            select: {
                id: true,
                fullName: true,
                role: true,
                username: true,
                email: true,
                status: true,
                payRate: true,
                workingDays: true
            }
        });

        // Map to match the frontend expected format
        const mappedStaff = staff.map(s => ({
            staffId: s.id,
            fullName: s.fullName,
            role: s.role,
            username: s.username,
            email: s.email,
            status: s.status,
            payRate: s.payRate,
            workingDays: s.workingDays
        }));

        return NextResponse.json(mappedStaff);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
