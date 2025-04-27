import { MultipartFile } from '@fastify/multipart';

import { FileRepository } from '../repositories/file.repository';
import { FileUploadService } from './file-upload.service';

export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private fileUploadService: FileUploadService
  ) {}

  /**
   * Upload a file and create a record in the database
   */
  async uploadFile(file: MultipartFile, userId: string) {
    // Upload file to S3
    const uploadResult = await this.fileUploadService.uploadToS3(file);

    // Create file record in database
    const fileRecord = await this.fileRepository.createFile({
      filename: uploadResult.filename,
      path: uploadResult.url,
      mimetype: uploadResult.mimetype,
      size: uploadResult.size,
      userId,
    });

    return {
      ...fileRecord,
      url: uploadResult.url,
    };
  }

  /**
   * Get file by ID
   */
  async getFileById(id: string) {
    return this.fileRepository.getFileById(id);
  }

  /**
   * Get all files for a user
   */
  async getFilesByUserId(userId: string) {
    return this.fileRepository.getFilesByUserId(userId);
  }

  /**
   * Get all files
   */
  async getAllFiles() {
    return this.fileRepository.getAllFiles();
  }

  /**
   * Delete a file
   */
  async deleteFile(id: string) {
    const file = await this.fileRepository.getFileById(id);
    if (!file) {
      throw new Error('File not found');
    }

    // Extract the key from the path
    const url = new URL(file.path);
    const pathParts = url.pathname.split('/');
    const key = pathParts[pathParts.length - 1];

    // Delete from S3
    await this.fileUploadService.deleteFromS3(key);

    // Delete from database
    return this.fileRepository.deleteFile(id);
  }
} 