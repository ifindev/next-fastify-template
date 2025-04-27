import { DeleteObjectCommand,PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'crypto';
import { createWriteStream } from 'fs';
import { mkdir, unlink } from 'fs/promises';
import { extname,join } from 'path';
import { pipeline } from 'stream/promises';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true, // Needed for MinIO and other S3-compatible storage
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
});

// Define the bucket name
const bucketName = process.env.S3_BUCKET_NAME || 'uploads';

// The base upload directory for temporary file storage
const UPLOAD_DIR = join(process.cwd(), 'uploads');

export class FileUploadService {
  /**
   * Upload a file to S3 storage
   */
  async uploadToS3(file: MultipartFile): Promise<{ key: string; url: string; filename: string; mimetype: string; size: number }> {
    try {
      // Ensure the upload directory exists
      await mkdir(UPLOAD_DIR, { recursive: true });
      
      // Create a unique filename
      const fileId = randomUUID();
      const fileExt = extname(file.filename);
      const sanitizedFilename = file.filename.replace(/[^a-zA-Z0-9.]/g, '_');
      const objectKey = `${fileId}${fileExt}`;
      const tempFilePath = join(UPLOAD_DIR, objectKey);
      
      // Save the file temporarily
      await pipeline(file.file, createWriteStream(tempFilePath));

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: await file.toBuffer(),
        ContentType: file.mimetype,
      });
      
      await s3Client.send(command);
      
      // Remove temporary file
      await unlink(tempFilePath);
      
      // Determine the S3 URL format
      const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000';
      const url = `${endpoint}/${bucketName}/${objectKey}`;
      
      return {
        key: objectKey,
        url,
        filename: sanitizedFilename,
        mimetype: file.mimetype,
        size: file.file.bytesRead,
      };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  /**
   * Delete a file from S3 storage
   */
  async deleteFromS3(fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      });
      
      await s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error('Failed to delete file from storage');
    }
  }
} 