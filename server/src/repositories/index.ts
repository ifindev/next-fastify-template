import { FileRepository } from './file.repository';
import { RefreshTokenRepository } from './refresh-token.repository';
import { UserRepository } from './user.repository';

export const userRepository = new UserRepository();
export const fileRepository = new FileRepository();
export const refreshTokenRepository = new RefreshTokenRepository();

export * from './interfaces';
export { FileRepository, RefreshTokenRepository, UserRepository };
