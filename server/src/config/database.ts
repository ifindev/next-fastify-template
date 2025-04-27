// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '../../generated/prisma';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

// Create a singleton instance of PrismaClient
export const prisma = new PrismaClient();

// Extend FastifyInstance to include prisma
declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}

// Export a Fastify plugin to make Prisma available in the request context
export const prismaPlugin = fp(async (fastify: FastifyInstance) => {
    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (instance) => {
        await instance.prisma.$disconnect();
    });
});
