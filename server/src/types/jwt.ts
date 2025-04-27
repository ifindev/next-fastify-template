import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      role: string;
      iat?: number;
      exp?: number;
    };
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
} 