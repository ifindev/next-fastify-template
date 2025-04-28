import { NewRefreshToken, RefreshToken } from '../../schemas/db/refresh-tokens.schema';

export interface IRefreshTokenRepository {
    createToken(tokenData: NewRefreshToken): Promise<RefreshToken>;
    findByToken(token: string): Promise<RefreshToken | null>;
    deleteToken(id: string): Promise<void>;
    deleteAllUserTokens(userId: string): Promise<void>;
}
