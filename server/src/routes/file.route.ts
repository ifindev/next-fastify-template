import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { FileUploadService } from '@/services/file-upload.service';

import { prisma } from '../config/database';
import { FileController } from '../controllers/file.controller';
import { FileRepository } from '../repositories/file.repository';
import { FileService } from '../services/file.service';

export async function fileRoutes(fastify: FastifyInstance) {
  // Initialize dependencies
  const fileRepository = new FileRepository(prisma);
  const fileUploadService = new FileUploadService();
  const fileService = new FileService(fileRepository, fileUploadService);
  const fileController = new FileController(fileService);

  // Helper functions for auth checks
  const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  };

  const requireAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      if (request.user.role !== 'ADMIN') {
        return reply.code(403).send({ message: 'Forbidden' });
      }
    } catch (err) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  };

  // File routes
  fastify.post(
    '/upload',
    { preHandler: requireAuth },
    (request, reply) => fileController.uploadFile(request, reply)
  );

  fastify.get(
    '/my-files',
    { preHandler: requireAuth },
    (request, reply) => fileController.getUserFiles(request, reply)
  );

  fastify.get<{ Params: { id: string } }>(
    '/files/:id',
    { preHandler: requireAuth },
    (request, reply) => fileController.getFileById(request, reply)
  );

  fastify.delete<{ Params: { id: string } }>(
    '/files/:id',
    { preHandler: requireAuth },
    (request, reply) => fileController.deleteFile(request, reply)
  );

  // Admin routes
  fastify.get(
    '/admin/files',
    { preHandler: requireAdmin },
    (request, reply) => fileController.getAllFiles(request, reply)
  );
} 