import { File, NewFile } from '../../schemas/files.schema';

export interface IFileRepository {
    createFile(fileData: NewFile): Promise<File>;
    findById(id: string): Promise<File | null>;
    findByUserId(userId: string): Promise<File[]>;
    updateFile(id: string, data: Partial<NewFile>): Promise<File>;
    deleteFile(id: string): Promise<File>;
    getAllFiles(): Promise<File[]>;
}
