import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);
  
  // Handle validation errors
  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: error.message,
      validationErrors: error.validation,
    });
  }

  // Handle custom errors
  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    });
  }

  // Handle unknown errors
  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An internal server error occurred',
  });
}; 