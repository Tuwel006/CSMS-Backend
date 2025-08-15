import { Request, Response } from "express"
import * as authService from '../services/auth.service';
export const registerController = async (req: Request, res: Response) => {
    const user = await authService.register(req.body);
    res.status(201).json(user);
}

export  const loginController = async(req: Request, res: Response) => {
    const token = await authService.login(req.body);
    res.json({token});
}