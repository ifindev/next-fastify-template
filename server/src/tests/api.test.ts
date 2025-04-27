import { FastifyInstance } from 'fastify';

import { buildServer } from '../app';
import { prisma } from '../config/database';

describe('API Integration Tests', () => {
  let server: FastifyInstance;
  let token: string;

  beforeAll(async () => {
    // Create test server
    server = await buildServer();
    
    // Clear database tables for test
    await prisma.file.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    // Clean up database after tests
    await prisma.file.deleteMany({});
    await prisma.user.deleteMany({});
    
    // Close server
    await server.close();
  });

  describe('Authentication API', () => {
    it('should register a new user', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'test@example.com',
          password: 'test1234',
          name: 'Test User',
        },
      });

      const result = JSON.parse(response.payload);
      
      expect(response.statusCode).toBe(201);
      expect(result.message).toBe('User registered successfully');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email', 'test@example.com');
    });

    it('should login with valid credentials', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: 'test@example.com',
          password: 'test1234',
        },
      });

      const result = JSON.parse(response.payload);
      
      expect(response.statusCode).toBe(200);
      expect(result.message).toBe('Login successful');
      expect(result.token).toBeTruthy();
      
      // Save token for subsequent tests
      token = result.token;
    });

    it('should return user information when authenticated', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/auth/me',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const result = JSON.parse(response.payload);
      
      expect(response.statusCode).toBe(200);
      expect(result.user).toHaveProperty('email', 'test@example.com');
    });

    it('should reject unauthorized access', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/auth/me',
      });
      
      expect(response.statusCode).toBe(401);
    });
  });
}); 