import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create a default tenant
    const tenant = await prisma.tenant.upsert({
        where: { id: 'default-tenant-id' },
        update: {},
        create: {
            id: 'default-tenant-id',
            name: 'OmniPOS Main Branch',
            appName: 'OmniPOS',
            primaryColor: '#38bdf8',
            secondaryColor: '#818cf8',
            themeMode: 'dark',
        },
    });

    console.log('Tenant created:', tenant.name);

    // Seed staff members
    const staff = [
        {
            fullName: 'System Admin',
            role: 'Admin',
            username: 'admin',
            password: 'admin123',
            email: 'admin@omnipos.com',
        },
        {
            fullName: 'Kitchen Staff',
            role: 'Kitchen',
            username: 'kitchen',
            password: 'kitchen123',
            email: 'kitchen@omnipos.com',
        },
        {
            fullName: 'Senior Waiter',
            role: 'Waiter',
            username: 'waiter',
            password: 'waiter123',
            email: 'waiter@omnipos.com',
        },
        {
            fullName: 'Main Till',
            role: 'Till',
            username: 'till',
            password: 'till123',
            email: 'till@omnipos.com',
        },
    ];

    for (const s of staff) {
        const passwordHash = await bcrypt.hash(s.password, 10);
        await prisma.staff.upsert({
            where: { username: s.username },
            update: {
                passwordHash,
                tenantId: tenant.id,
            },
            create: {
                fullName: s.fullName,
                role: s.role,
                username: s.username,
                passwordHash,
                email: s.email,
                tenantId: tenant.id,
            },
        });
    }

    console.log('Staff accounts seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
