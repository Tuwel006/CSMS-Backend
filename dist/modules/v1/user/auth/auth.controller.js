"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthController = void 0;
const auth_service_1 = require("./auth.service");
const ApiResponse_1 = require("../../../../utils/ApiResponse");
class UserAuthController {
    static async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const user = await auth_service_1.AuthService.register({ username, email, password });
            const response = ApiResponse_1.ApiResponse.created({ user }, 'User registered successfully');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.badRequest(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { token, user, activeMatchId } = await auth_service_1.AuthService.login(email, password);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            const response = ApiResponse_1.ApiResponse.success({ token, user, activeMatchId }, 'Login successful');
            res.status(response.status).json(response);
        }
        catch (error) {
            const errorResponse = ApiResponse_1.ApiResponse.unauthorized(error.message);
            res.status(errorResponse.status).json(errorResponse);
        }
    }
}
exports.UserAuthController = UserAuthController;
