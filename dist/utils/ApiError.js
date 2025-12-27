"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = 'ApiError';
    }
    static badRequest(message = 'Bad request') {
        return new ApiError(400, 'BAD_REQUEST', message);
    }
    static unauthorized(message = 'Unauthorized') {
        return new ApiError(401, 'UNAUTHORIZED', message);
    }
    static forbidden(message = 'Forbidden') {
        return new ApiError(403, 'FORBIDDEN', message);
    }
    static notFound(message = 'Not found') {
        return new ApiError(404, 'NOT_FOUND', message);
    }
    static serverError(message = 'Internal server error') {
        return new ApiError(500, 'SERVER_ERROR', message);
    }
}
exports.ApiError = ApiError;
