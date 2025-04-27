import { compare, hash } from 'bcrypt';

import { userRepository } from '../repositories';
import { IUserRepository } from '../repositories/interfaces';
import { User } from '../schemas';

export class AuthService {
    private userRepository: IUserRepository;

    constructor(userRepo: IUserRepository = userRepository) {
        this.userRepository = userRepo;
    }

    /**
     * Register a new user
     */
    async register(userData: {
        email: string;
        password: string;
        name: string;
    }): Promise<Omit<User, 'password'>> {
        const { email, password, name } = userData;

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create the user
        const user = await this.userRepository.createUser({
            email,
            password: hashedPassword,
            name,
        });

        // Remove password from returned object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Login a user and return JWT token
     */
    async login(credentials: {
        email: string;
        password: string;
    }): Promise<{ user: Omit<User, 'password'>; token: string }> {
        const { email, password } = credentials;

        // Find the user
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Remove password from returned object
        const { password: _, ...userWithoutPassword } = user;

        // Token will be generated at the controller level using fastify.jwt
        return { user: userWithoutPassword, token: '' };
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            return null;
        }

        // Remove password from returned object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
