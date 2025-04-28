import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';

import { refreshTokenRepository, userRepository } from '../repositories';
import { IRefreshTokenRepository, IUserRepository } from '../repositories/interfaces';
import { RefreshToken, User } from '../schemas/db';

export class AuthService {
    private userRepository: IUserRepository;
    private refreshTokenRepository: IRefreshTokenRepository;

    constructor(
        userRepo: IUserRepository = userRepository,
        refreshTokenRepo: IRefreshTokenRepository = refreshTokenRepository,
    ) {
        this.userRepository = userRepo;
        this.refreshTokenRepository = refreshTokenRepo;
    }

    /**
     * Register a new user
     */
    async register(userData: {
        email: string;
        password: string;
        name: string;
    }): Promise<Omit<User, 'password'>> {
        const { email, password, name } = userData;

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the user
        const user = await this.userRepository.createUser({
            email,
            password: hashedPassword,
            name,
        });

        // Remove password from returned object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Login a user and return tokens
     */
    async login(credentials: {
        email: string;
        password: string;
    }): Promise<{ user: Omit<User, 'password'>; token: string; refreshToken: string }> {
        const { email, password } = credentials;

        // Find the user
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate refresh token
        const refreshToken = await this.generateRefreshToken(user.id);

        // Remove password from returned object
        const { password: _, ...userWithoutPassword } = user;

        // Token will be generated at the controller level using fastify.jwt
        return { user: userWithoutPassword, token: '', refreshToken: refreshToken.token };
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            return null;
        }

        // Remove password from returned object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Generate a refresh token for a user
     */
    private async generateRefreshToken(userId: string): Promise<RefreshToken> {
        // Generate a random token
        const token = randomBytes(64).toString('hex');

        // Set expiration date (30 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        // Create the token in database
        return this.refreshTokenRepository.createToken({
            token,
            userId,
            expiresAt,
        });
    }

    /**
     * Refresh the access token using a refresh token
     */
    async refreshAccessToken(
        refreshToken: string,
    ): Promise<{ user: Omit<User, 'password'>; token: string } | null> {
        // Find the refresh token
        const tokenDoc = await this.refreshTokenRepository.findByToken(refreshToken);

        if (!tokenDoc) {
            return null;
        }

        // Check if token is expired
        if (new Date() > tokenDoc.expiresAt) {
            await this.refreshTokenRepository.deleteToken(tokenDoc.id);
            return null;
        }

        // Get the user
        const user = await this.userRepository.findById(tokenDoc.userId);

        if (!user) {
            await this.refreshTokenRepository.deleteToken(tokenDoc.id);
            return null;
        }

        // Remove password from returned object
        const { password: _, ...userWithoutPassword } = user;

        // Token will be generated at the controller level
        return { user: userWithoutPassword, token: '' };
    }

    /**
     * Invalidate a refresh token
     */
    async revokeRefreshToken(refreshToken: string): Promise<boolean> {
        const tokenDoc = await this.refreshTokenRepository.findByToken(refreshToken);

        if (!tokenDoc) {
            return false;
        }

        await this.refreshTokenRepository.deleteToken(tokenDoc.id);
        return true;
    }

    /**
     * Invalidate all refresh tokens for a user
     */
    async revokeAllUserTokens(userId: string): Promise<void> {
        await this.refreshTokenRepository.deleteAllUserTokens(userId);
    }
}
