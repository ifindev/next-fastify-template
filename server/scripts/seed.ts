#!/usr/bin/env node
import 'dotenv/config';

import { hash } from 'bcrypt';
import { eq } from 'drizzle-orm';

import { db, pool } from '../src/config/drizzle.config';
import { users } from '../src/schemas/db/users.schema';

async function seed() {
    console.log('Seeding database...');

    try {
        // Create a default admin user
        const adminExists = await db
            .select()
            .from(users)
            .where(eq(users.email, 'admin@example.com'));

        if (adminExists.length === 0) {
            const adminPassword = await hash('adminpassword', 10);

            await db.insert(users).values({
                email: 'admin@example.com',
                password: adminPassword,
                name: 'Admin User',
                role: 'ADMIN',
            });

            console.log('Created admin user: admin@example.com');
        } else {
            console.log('Admin user already exists, skipping...');
        }

        // Create a default regular user
        const userExists = await db.select().from(users).where(eq(users.email, 'user@example.com'));

        if (userExists.length === 0) {
            const userPassword = await hash('userpassword', 10);

            await db.insert(users).values({
                email: 'user@example.com',
                password: userPassword,
                name: 'Regular User',
                role: 'USER',
            });

            console.log('Created regular user: user@example.com');
        } else {
            console.log('Regular user already exists, skipping...');
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    } finally {
        // Close the database connection
        await pool.end();
    }

    process.exit(0);
}

seed();
