import { NewUser, User } from '../../schemas/db/users.schema';

export interface IUserRepository {
    createUser(userData: NewUser): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    updateUser(id: string, data: Partial<NewUser>): Promise<User>;
    updatePassword(id: string, password: string): Promise<User>;
    deleteUser(id: string): Promise<User>;
    getAllUsers(): Promise<Omit<User, 'password'>[]>;
}
