import { eq } from 'drizzle-orm';

import { db } from '../config/drizzle.config';
import { File, files, NewFile } from '../schemas/db';
import { IFileRepository } from './interfaces';

export class FileRepository implements IFileRepository {
    /**
     * Create a new file
     */
    async createFile(fileData: NewFile): Promise<File> {
        const result = await db.insert(files).values(fileData).returning();
        return result[0];
    }

    /**
     * Find file by ID
     */
    async findById(id: string): Promise<File | null> {
        const result = await db.select().from(files).where(eq(files.id, id));
        return result[0] || null;
    }

    /**
     * Find files by user ID
     */
    async findByUserId(userId: string): Promise<File[]> {
        return db.select().from(files).where(eq(files.userId, userId));
    }

    /**
     * Update file
     */
    async updateFile(id: string, data: Partial<NewFile>): Promise<File> {
        const result = await db.update(files).set(data).where(eq(files.id, id)).returning();
        return result[0];
    }

    /**
     * Delete file
     */
    async deleteFile(id: string): Promise<File> {
        const result = await db.delete(files).where(eq(files.id, id)).returning();
        return result[0];
    }

    /**
     * Get all files
     */
    async getAllFiles(): Promise<File[]> {
        return db.select().from(files);
    }
}
