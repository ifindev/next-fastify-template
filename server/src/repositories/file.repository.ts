import { PrismaClient } from '@prisma/client';

export class FileRepository {
    constructor(private prisma: PrismaClient) {}

    /**
     * Create a new file record
     */
    async createFile(fileData: {
        filename: string;
        path: string;
        mimetype: string;
        size: number;
        userId: string;
    }) {
        return this.prisma.file.create({
            data: fileData,
        });
    }

    /**
     * Get file by ID
     */
    async getFileById(id: string) {
        return this.prisma.file.findUnique({
            where: { id },
            include: { user: true },
        });
    }

    /**
     * Get files by user ID
     */
    async getFilesByUserId(userId: string) {
        return this.prisma.file.findMany({
            where: { userId },
            orderBy: {
                uploadedAt: 'desc',
            },
        });
    }

    /**
     * Get all files
     */
    async getAllFiles() {
        return this.prisma.file.findMany({
            orderBy: {
                uploadedAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    /**
     * Delete file by ID
     */
    async deleteFile(id: string) {
        return this.prisma.file.delete({
            where: { id },
        });
    }
}
