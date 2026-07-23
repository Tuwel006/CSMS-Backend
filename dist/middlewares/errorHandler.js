"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const ApiResponse_1 = require("../utils/ApiResponse");
function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    console.error(err);
    const response = ApiResponse_1.ApiResponse.serverError(message);
    res.status(status).json(response);
}
