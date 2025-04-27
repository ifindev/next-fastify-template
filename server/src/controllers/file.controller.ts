import { FastifyReply,FastifyRequest } from 'fastify';

import { FileService } from '../services/file.service';

export class FileController {
  constructor(private fileService: FileService) {}

  /**
   * Upload a file
   */
  async uploadFile(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get authenticated user
      const userId = request.user.id;
      
      // Get file from request
      const file = await request.file();
      
      if (!file) {
        return reply.code(400).send({
          message: 'No file uploaded',
        });
      }
      
      const result = await this.fileService.uploadFile(file, userId);
      
      return reply.code(201).send({
        message: 'File uploaded successfully',
        file: result,
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        message: 'Failed to upload file',
      });
    }
  }

  /**
   * Get all files for the current user
   */
  async getUserFiles(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.id;
      const files = await this.fileService.getFilesByUserId(userId);
      
      return reply.code(200).send({
        files,
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        message: 'Failed to get files',
      });
    }
  }

  /**
   * Get file by ID
   */
  async getFileById(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const file = await this.fileService.getFileById(id);
      
      if (!file) {
        return reply.code(404).send({
          message: 'File not found',
        });
      }
      
      // Check if user owns the file or is an admin
      const userId = request.user.id;
      if (file.userId !== userId && request.user.role !== 'ADMIN') {
        return reply.code(403).send({
          message: 'You do not have permission to access this file',
        });
      }
      
      return reply.code(200).send({
        file,
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        message: 'Failed to get file',
      });
    }
  }

  /**
   * Delete file by ID
   */
  async deleteFile(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const file = await this.fileService.getFileById(id);
      
      if (!file) {
        return reply.code(404).send({
          message: 'File not found',
        });
      }
      
      // Check if user owns the file or is an admin
      const userId = request.user.id;
      if (file.userId !== userId && request.user.role !== 'ADMIN') {
        return reply.code(403).send({
          message: 'You do not have permission to delete this file',
        });
      }
      
      await this.fileService.deleteFile(id);
      
      return reply.code(200).send({
        message: 'File deleted successfully',
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        message: 'Failed to delete file',
      });
    }
  }

  /**
   * Get all files (admin only)
   */
  async getAllFiles(request: FastifyRequest, reply: FastifyReply) {
    try {
      const files = await this.fileService.getAllFiles();
      
      return reply.code(200).send({
        files,
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        message: 'Failed to get files',
      });
    }
  }
} 