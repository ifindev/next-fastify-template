import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcrypt';

// Define our own User type interface based on Prisma schema
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Register a new user
   */
  async register(userData: { email: string; password: string; name: string }): Promise<Omit<User, 'password'>> {
    const { email, password, name } = userData;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Remove password from returned object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'>;
  }

  /**
   * Login a user and return JWT token
   */
  async login(credentials: { email: string; password: string }): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, password } = credentials;

    // Find the user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

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
    return { user: userWithoutPassword as Omit<User, 'password'>, token: '' };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    // Remove password from returned object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, 'password'>;
  }
} 