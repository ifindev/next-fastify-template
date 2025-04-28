import { eq } from 'drizzle-orm';

import { db } from '../config/drizzle.config';
import { NewUser, User, users } from '../schemas/db';
import { IUserRepository } from './interfaces';

export class UserRepository implements IUserRepository {
    /**
     * Create a new user
     */
    async createUser(userData: NewUser): Promise<User> {
        const result = await db.insert(users).values(userData).returning();
        return result[0];
    }

    /**
     * Find user by ID
     */
    async findById(id: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.id, id));
        return result[0] || null;
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.email, email));
        return result[0] || null;
    }

    /**
     * Update user
     */
    async updateUser(id: string, data: Partial<NewUser>): Promise<User> {
        const result = await db
            .update(users)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(users.id, id))
            .returning();
        return result[0];
    }

    /**
     * Update user password
     */
    async updatePassword(id: string, password: string): Promise<User> {
        const result = await db
            .update(users)
            .set({
                password,
                updatedAt: new Date(),
            })
            .where(eq(users.id, id))
            .returning();
        return result[0];
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<User> {
        const result = await db.delete(users).where(eq(users.id, id)).returning();
        return result[0];
    }

    /**
     * Get all users
     */
    async getAllUsers(): Promise<Omit<User, 'password'>[]> {
        const result = await db
            .select({
                id: users.id,
                email: users.email,
                name: users.name,
                role: users.role,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(users);
        return result;
    }
}
