import { MultipartFile } from '@fastify/multipart';

import { fileRepository } from '../repositories';
import { IFileRepository } from '../repositories/interfaces';
import { File } from '../schemas/db';
import { FileUploadService } from './file-upload.service';

export class FileService {
    private fileRepository: IFileRepository;
    private fileUploadService: FileUploadService;

    constructor(
        fileRepo: IFileRepository = fileRepository,
        fileUploadService: FileUploadService = new FileUploadService(),
    ) {
        this.fileRepository = fileRepo;
        this.fileUploadService = fileUploadService;
    }

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
     * Create a new file record
     */
    async createFile(fileData: {
        filename: string;
        path: string;
        mimetype: string;
        size: number;
        userId: string;
    }): Promise<File> {
        return this.fileRepository.createFile(fileData);
    }

    /**
     * Get file by ID
     */
    async getFileById(id: string): Promise<File | null> {
        return this.fileRepository.findById(id);
    }

    /**
     * Get files by user ID
     */
    async getFilesByUserId(userId: string): Promise<File[]> {
        return this.fileRepository.findByUserId(userId);
    }

    /**
     * Get all files
     */
    async getAllFiles(): Promise<File[]> {
        return this.fileRepository.getAllFiles();
    }

    /**
     * Delete file by ID
     */
    async deleteFile(id: string): Promise<File> {
        const file = await this.fileRepository.findById(id);
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
