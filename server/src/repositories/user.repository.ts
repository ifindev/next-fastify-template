import { PrismaClient } from '@prisma/client';

export class UserRepository {
    constructor(private prisma: PrismaClient) {}

    /**
     * Create a new user
     */
    async createUser(userData: {
        email: string;
        password: string;
        name: string;
        role?: 'USER' | 'ADMIN';
    }) {
        return this.prisma.user.create({
            data: userData,
        });
    }

    /**
     * Find user by ID
     */
    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Update user
     */
    async updateUser(
        id: string,
        data: {
            email?: string;
            name?: string;
            role?: 'USER' | 'ADMIN';
        },
    ) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    /**
     * Update user password
     */
    async updatePassword(id: string, password: string) {
        return this.prisma.user.update({
            where: { id },
            data: { password },
        });
    }

    /**
     * Delete user
     */
    async deleteUser(id: string) {
        return this.prisma.user.delete({
            where: { id },
        });
    }

    /**
     * Get all users
     */
    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
