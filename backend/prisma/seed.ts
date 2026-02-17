import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Admin
    await prisma.user.upsert({
        where: { email: 'admin@cuciin.com' },
        update: {},
        create: {
            email: 'admin@cuciin.com',
            password: hashedPassword,
            name: 'Super Admin',
            role: 'ADMIN',
        },
    });

    // 2. Create Customer
    await prisma.user.upsert({
        where: { email: 'budi@cuciin.com' },
        update: {},
        create: {
            email: 'budi@cuciin.com',
            password: hashedPassword,
            name: 'Budi Santoso',
            role: 'CUSTOMER',
            phone: '08123456789',
            lat: -7.2855,
            lng: 112.7483,
            address: 'Jl. Gubeng No. 123, Surabaya',
        },
    });

    // 3. Create Partner (Laundry)
    const partnerUser = await prisma.user.upsert({
        where: { email: 'clean@cuciin.com' },
        update: {},
        create: {
            email: 'clean@cuciin.com',
            password: hashedPassword,
            name: 'Clean & Fresh Laundry',
            role: 'PARTNER',
            phone: '082233445566',
            lat: -7.2755,
            lng: 112.7583,
            address: 'Jl. Manyar Kertoarjo No. 50, Surabaya',
        },
    });

    await prisma.partner.upsert({
        where: { userId: partnerUser.id },
        update: {},
        create: {
            userId: partnerUser.id,
            name: 'Clean & Fresh Laundry HQ',
            address: 'Jl. Manyar Kertoarjo No. 50, Surabaya',
            lat: -7.2755,
            lng: 112.7583,
            capacity: 50,
            currentLoad: 10,
            rating: 4.8,
            isVerified: true,
        },
    });

    // 4. Create Courier
    const courierUser = await prisma.user.upsert({
        where: { email: 'slamet@cuciin.com' },
        update: {},
        create: {
            email: 'slamet@cuciin.com',
            password: hashedPassword,
            name: 'Slamet Driver',
            role: 'COURIER',
            phone: '085566778899',
            lat: -7.2655,
            lng: 112.7383,
            address: 'Kantor Kurir Cuciin Surabaya',
        },
    });

    await prisma.courier.upsert({
        where: { userId: courierUser.id },
        update: {},
        create: {
            userId: courierUser.id,
            isActive: true,
        },
    });

    console.log('Seed data created successfully! 🚀');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
