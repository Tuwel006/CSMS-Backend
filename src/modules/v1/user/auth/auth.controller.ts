import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto } from "./auth.dto";
import { ApiResponse } from "../../../../utils/ApiResponse";

export class UserAuthController {
  static async register(req: Request<{}, {}, RegisterDto>, res: Response) {
    try {
      const { username, email, password }: RegisterDto = req.body;
      const user = await AuthService.register({ username, email, password });
      const response = ApiResponse.created({ user }, 'User registered successfully');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.badRequest(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }

  static async login(req: Request<{}, {}, LoginDto>, res: Response) {
    try {
      const { email, password }: LoginDto = req.body;
      const { token, user, activeMatchId } = await AuthService.login(email, password);
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      const response = ApiResponse.success({ token, user, activeMatchId }, 'Login successful');
      res.status(response.status).json(response);
    } catch (error: any) {
      const errorResponse = ApiResponse.unauthorized(error.message);
      res.status(errorResponse.status).json(errorResponse);
    }
  }
}