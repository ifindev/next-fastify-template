export const loginSchema = {
    description: 'Login user',
    tags: ['auth'],
    summary: 'Login existing user and get JWT token',
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'User email',
            },
            password: {
                type: 'string',
                minLength: 6,
                description: 'User password',
            },
        },
    },
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                message: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    },
                },
                token: { type: 'string' },
                refreshToken: { type: 'string' },
            },
        },
        401: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        500: {
            description: 'Server error',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};

export const registerSchema = {
    description: 'Register user',
    tags: ['auth'],
    summary: 'Register a new user',
    body: {
        type: 'object',
        required: ['email', 'password', 'name'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                description: 'User email',
            },
            password: {
                type: 'string',
                minLength: 6,
                description: 'User password',
            },
            name: {
                type: 'string',
                description: 'User full name',
            },
        },
    },
    response: {
        201: {
            description: 'Successful registration',
            type: 'object',
            properties: {
                message: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    },
                },
            },
        },
        409: {
            description: 'Conflict - User already exists',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        500: {
            description: 'Server error',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};

export const meSchema = {
    description: 'Get current user',
    tags: ['auth'],
    summary: 'Get current authenticated user information',
    security: [{ bearerAuth: [] }],
    response: {
        200: {
            description: 'Successful response',
            type: 'object',
            properties: {
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    },
                },
            },
        },
        401: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        404: {
            description: 'User not found',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        500: {
            description: 'Server error',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};

export const refreshTokenSchema = {
    description: 'Refresh access token',
    tags: ['auth'],
    summary: 'Get a new access token using a refresh token',
    body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
            refreshToken: {
                type: 'string',
                description: 'Refresh token obtained during login',
            },
        },
    },
    response: {
        200: {
            description: 'Successful token refresh',
            type: 'object',
            properties: {
                message: { type: 'string' },
                token: { type: 'string' },
                refreshToken: { type: 'string' },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    },
                },
            },
        },
        401: {
            description: 'Invalid or expired refresh token',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        500: {
            description: 'Server error',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
};
