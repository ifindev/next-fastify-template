import { integer, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { users } from './users.schema';

// Define files table
export const files = pgTable('files', {
    id: uuid('id').primaryKey().defaultRandom(),
    filename: varchar('filename', { length: 255 }).notNull(),
    path: varchar('path', { length: 255 }).notNull(),
    mimetype: varchar('mimetype', { length: 255 }).notNull(),
    size: integer('size').notNull(),
    userId: uuid('user_id')
        .notNull()
        .references(() => users.id),
    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
});

// Export type for TypeScript
export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;
