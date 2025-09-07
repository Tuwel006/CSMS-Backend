import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

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
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
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
      
      res.status(200).json({ token, user });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
