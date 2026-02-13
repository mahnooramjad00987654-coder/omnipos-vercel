import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
    const user = await verifyAuth(request);
    if (!user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: user.tenant_id },
        });

        if (!tenant) return NextResponse.json({ message: 'Tenant not found' }, { status: 404 });

        return NextResponse.json({
            appName: tenant.appName,
            logoUrl: tenant.logoUrl,
            primaryColor: tenant.primaryColor,
            secondaryColor: tenant.secondaryColor,
            themeMode: tenant.themeMode
        });
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
        // Support both PascalCase (from C# logic) and camelCase
        const updates = {
            appName: body.appName || body.AppName,
            logoUrl: body.logoUrl || body.LogoUrl,
            primaryColor: body.primaryColor || body.PrimaryColor,
            secondaryColor: body.secondaryColor || body.SecondaryColor,
            themeMode: body.themeMode || body.ThemeMode,
        };

        const tenant = await prisma.tenant.update({
            where: { id: user.tenant_id },
            data: updates,
        });

        return NextResponse.json(tenant);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
