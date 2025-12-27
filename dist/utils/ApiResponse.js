"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(data, message = 'Success') {
        return {
            status: 200,
            code: 'SUCCESS',
            message,
            data
        };
    }
    static created(data, message = 'Created successfully') {
        return {
            status: 201,
            code: 'CREATED',
            message,
            data
        };
    }
    static badRequest(message = 'Bad request') {
        return {
            status: 400,
            code: 'BAD_REQUEST',
            message
        };
    }
    static unauthorized(message = 'Unauthorized') {
        return {
            status: 401,
            code: 'UNAUTHORIZED',
            message
        };
    }
    static forbidden(message = 'Forbidden') {
        return {
            status: 403,
            code: 'FORBIDDEN',
            message
        };
    }
    static notFound(message = 'Not found') {
        return {
            status: 404,
            code: 'NOT_FOUND',
            message
        };
    }
    static serverError(message = 'Internal server error') {
        return {
            status: 500,
            code: 'SERVER_ERROR',
            message
        };
    }
}
exports.ApiResponse = ApiResponse;
