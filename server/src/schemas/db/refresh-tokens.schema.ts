import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { users } from './users.schema';

// Define refresh tokens table
export const refreshTokens = pgTable('refresh_tokens', {
    id: uuid('id').primaryKey().defaultRandom(),
    token: varchar('token', { length: 500 }).notNull().unique(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Export type for TypeScript
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
