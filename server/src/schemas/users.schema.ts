import { pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// Define role enum type
export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);

// Define users table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    role: roleEnum('role').default('USER').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Export type for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
