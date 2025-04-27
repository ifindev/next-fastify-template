import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

import { AuthService } from './auth.service';

// Mock PrismaClient
const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
} as unknown as PrismaClient;

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService(mockPrisma);
    });

    describe('register', () => {
        it('should register a new user', async () => {
            // Setup
            const userData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            // Mock implementation
            mockPrisma.user.findUnique.mockResolvedValueOnce(null);
            mockPrisma.user.create.mockResolvedValueOnce({
                id: '1',
                email: userData.email,
                password: 'hashedPassword',
                name: userData.name,
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Execute
            const result = await authService.register(userData);

            // Verify
            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: userData.email },
            });
            expect(mockPrisma.user.create).toHaveBeenCalled();
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('email', userData.email);
            expect(result).toHaveProperty('name', userData.name);
            expect(result).not.toHaveProperty('password');
        });

        it('should throw an error if user already exists', async () => {
            // Setup
            const userData = {
                email: 'existing@example.com',
                password: 'password123',
                name: 'Existing User',
            };

            // Mock implementation
            mockPrisma.user.findUnique.mockResolvedValueOnce({
                id: '1',
                email: userData.email,
                password: 'hashedPassword',
                name: userData.name,
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Execute & Verify
            await expect(authService.register(userData)).rejects.toThrow(
                'User with this email already exists',
            );
            expect(mockPrisma.user.create).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should login a user with valid credentials', async () => {
            // Setup
            const credentials = {
                email: 'test@example.com',
                password: 'password123',
            };

            // Create a real hashed password for testing
            const hashedPassword = await hash(credentials.password, 10);

            // Mock implementation
            mockPrisma.user.findUnique.mockResolvedValueOnce({
                id: '1',
                email: credentials.email,
                password: hashedPassword,
                name: 'Test User',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Execute
            const result = await authService.login(credentials);

            // Verify
            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { email: credentials.email },
            });
            expect(result).toHaveProperty('user');
            expect(result.user).toHaveProperty('id', '1');
            expect(result.user).toHaveProperty('email', credentials.email);
            expect(result.user).not.toHaveProperty('password');
        });

        it('should throw an error if user does not exist', async () => {
            // Setup
            const credentials = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            // Mock implementation
            mockPrisma.user.findUnique.mockResolvedValueOnce(null);

            // Execute & Verify
            await expect(authService.login(credentials)).rejects.toThrow(
                'Invalid email or password',
            );
        });

        it('should throw an error if password is invalid', async () => {
            // Setup
            const credentials = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            // Mock implementation
            mockPrisma.user.findUnique.mockResolvedValueOnce({
                id: '1',
                email: credentials.email,
                password: 'hashedPassword', // This won't match the password
                name: 'Test User',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // Execute & Verify
            await expect(authService.login(credentials)).rejects.toThrow(
                'Invalid email or password',
            );
        });
    });
});
