import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { AUTH_MESSAGES } from "../../../constants/messages";
import { HTTP_STATUS } from "../../../constants/status-codes";

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization endpoints
 */
export class AuthController {
  static async register(req: Request, res: Response) {
    try {
    //   const { email, password } = req.body;
      const user = await AuthService.register(req.body);
      res.status(HTTP_STATUS.CREATED).json({ message: AUTH_MESSAGES.USER_REGISTERED, user });
    } catch (error: any) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, user } = await AuthService.login(email, password);
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.status(HTTP_STATUS.OK).json({ token, user });
    } catch (error: any) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: error.message });
    }
  }
}
