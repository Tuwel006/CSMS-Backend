"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_RESPONSE = void 0;
exports.HTTP_RESPONSE = {
    // Success responses
    OK: (message, data) => ({
        status: 200,
        code: 'SUCCESS',
        message,
        data
    }),
    CREATED: (message, data) => ({
        status: 201,
        code: 'CREATED',
        message,
        data
    }),
    UPDATED: (message, data) => ({
        status: 200,
        code: 'UPDATED',
        message,
        data
    }),
    DELETED: (message, data) => ({
        status: 200,
        code: 'DELETED',
        message,
        data
    }),
    // Error responses
    BAD_REQUEST: (message, error) => ({
        status: 400,
        code: 'BAD_REQUEST',
        message,
        error
    }),
    UNAUTHORIZED: (message, error) => ({
        status: 401,
        code: 'UNAUTHORIZED',
        message,
        error
    }),
    FORBIDDEN: (message, error) => ({
        status: 403,
        code: 'FORBIDDEN',
        message,
        error
    }),
    NOT_FOUND: (message, error) => ({
        status: 404,
        code: 'NOT_FOUND',
        message,
        error
    }),
    CONFLICT: (message, error) => ({
        status: 409,
        code: 'CONFLICT',
        message,
        error
    }),
    UNPROCESSABLE_ENTITY: (message, error) => ({
        status: 422,
        code: 'UNPROCESSABLE_ENTITY',
        message,
        error
    }),
    SERVER_ERROR: (message, error) => ({
        status: 500,
        code: 'SERVER_ERROR',
        message,
        error
    })
};
