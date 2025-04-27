import { FastifyReply,FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export interface AuthenticateOptions {
  roles?: string[];
}

export const authenticate = fp(async (fastify) => {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply, options: AuthenticateOptions = {}) => {
    try {
      await request.jwtVerify();
      
      // If roles are specified, check if the user has the required role
      if (options.roles && options.roles.length > 0) {
        const userRole = request.user.role;
        
        if (!options.roles.includes(userRole)) {
          return reply.code(403).send({
            statusCode: 403,
            error: 'Forbidden',
            message: 'You do not have permission to access this resource',
          });
        }
      }
    } catch (err) {
      return reply.code(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }
  });
}); 