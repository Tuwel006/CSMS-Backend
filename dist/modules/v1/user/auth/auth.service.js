"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../../../../config/db");
const User_1 = require("../../shared/entities/User");
const Match_1 = require("../../shared/entities/Match");
const messages_1 = require("../../../../constants/messages");
const status_codes_1 = require("../../../../constants/status-codes");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
class AuthService {
    static async register({ username, email, password }) {
        try {
            const userRepository = db_1.AppDataSource.getRepository(User_1.User);
            const existingUser = await userRepository.findOne({
                where: [
                    { email },
                    { username }
                ]
            });
            if (existingUser) {
                throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: messages_1.AUTH_MESSAGES.USER_EXISTS };
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 10);
            const user = userRepository.create({
                username,
                email,
                password: hashedPassword,
            });
            await userRepository.save(user);
            return { status: status_codes_1.HTTP_STATUS.CREATED, user };
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: status_codes_1.HTTP_STATUS.BAD_REQUEST, message: messages_1.AUTH_MESSAGES.EMAIL_USERNAME_UNIQUE };
            }
            if (error.status) {
                throw error;
            }
            console.error("Register error:", error);
            throw { status: status_codes_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, message: messages_1.AUTH_MESSAGES.INTERNAL_ERROR };
        }
    }
    static async login(email, password) {
        const userRepository = db_1.AppDataSource.getRepository(User_1.User);
        const matchRepository = db_1.AppDataSource.getRepository(Match_1.Match);
        const user = await userRepository.findOne({ where: { email } });
        if (!user)
            throw new Error(messages_1.AUTH_MESSAGES.INVALID_CREDENTIALS);
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword)
            throw new Error(messages_1.AUTH_MESSAGES.INVALID_CREDENTIALS);
        const expiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
            isGlobalAdmin: user.is_global_admin,
            tenantId: user.tenant_id,
        }, JWT_SECRET, { expiresIn: "7d" });
        let activeMatchId = null;
        if (user.tenant_id) {
            const activeMatch = await matchRepository.findOne({
                where: {
                    tenant_id: user.tenant_id,
                    is_active: true
                },
                select: ['id']
            });
            activeMatchId = activeMatch?.id || null;
        }
        return { token, user, activeMatchId };
    }
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
}
exports.AuthService = AuthService;
