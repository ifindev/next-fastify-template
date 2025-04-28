import { eq } from 'drizzle-orm';

import { db } from '../config/drizzle.config';
import { NewRefreshToken, RefreshToken, refreshTokens } from '../schemas/db';
import { IRefreshTokenRepository } from './interfaces/refresh-token-repository.interface';

export class RefreshTokenRepository implements IRefreshTokenRepository {
    /**
     * Create a new refresh token
     */
    async createToken(tokenData: NewRefreshToken): Promise<RefreshToken> {
        const result = await db.insert(refreshTokens).values(tokenData).returning();
        return result[0];
    }

    /**
     * Find refresh token by token value
     */
    async findByToken(token: string): Promise<RefreshToken | null> {
        const result = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
        return result[0] || null;
    }

    /**
     * Delete a refresh token
     */
    async deleteToken(id: string): Promise<void> {
        await db.delete(refreshTokens).where(eq(refreshTokens.id, id));
    }

    /**
     * Delete all refresh tokens for a user
     */
    async deleteAllUserTokens(userId: string): Promise<void> {
        await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    }
}
