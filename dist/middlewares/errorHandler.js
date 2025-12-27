"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    // Default to 500 Internal Server Error
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    // Optionally log the error
    console.error(err);
    res.status(status).json({
        success: false,
        error: {
            message,
        },
    });
}
