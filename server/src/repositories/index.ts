import { FileRepository } from './file.repository';
import { UserRepository } from './user.repository';

export const userRepository = new UserRepository();
export const fileRepository = new FileRepository();

export * from './interfaces';
export { FileRepository, UserRepository };
