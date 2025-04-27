import { FastifyReply,FastifyRequest } from 'fastify';

import { AuthService } from '@/services/auth.service';

export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Register a new user
   */
  async register(
    request: FastifyRequest<{
      Body: {
        email: string;
        password: string;
        name: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password, name } = request.body;
      const newUser = await this.authService.register({ email, password, name });
      
      return reply.code(201).send({
        message: 'User registered successfully',
        user: newUser,
      });
    } catch (error) {
      request.log.error(error);
      
      if (error instanceof Error && error.message === 'User with this email already exists') {
        return reply.code(409).send({
          message: error.message,
        });
      }
      
      return reply.code(500).send({
        message: 'Failed to register user',
      });
    }
  }

  /**
   * Login a user
   */
  async login(
    request: FastifyRequest<{
      Body: {
        email: string;
        password: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body;
      const result = await this.authService.login({ email, password });
      
      // Generate JWT token
      const token = request.server.jwt.sign(
        {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        }
      );
      
      return reply.code(200).send({
        message: 'Login successful',
        user: result.user,
        token,
      });
    } catch (error) {
      request.log.error(error);
      
      if (error instanceof Error && error.message === 'Invalid email or password') {
        return reply.code(401).send({
          message: 'Invalid email or password',
        });
      }
      
      return reply.code(500).send({
        message: 'Login failed',
      });
    }
  }

  /**
   * Get current user
   */
  async me(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get user from request (set by authentication hook)
      const user = request.user;
      
      if (!user || !user.id) {
        return reply.code(401).send({
          message: 'Unauthorized',
        });
      }
      
      const userData = await this.authService.getUserById(user.id);
      
      if (!userData) {
        return reply.code(404).send({
          message: 'User not found',
        });
      }
      
      return reply.code(200).send({
        user: userData,
      });
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        message: 'Failed to get user information',
      });
    }
  }
} 