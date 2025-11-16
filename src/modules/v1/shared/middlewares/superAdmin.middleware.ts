import { Response, NextFunction } from "express";
import { ApiResponse } from "../../../../utils/ApiResponse";
import { AuthRequest } from "../../../../types/auth.types";

export const superAdminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isGlobalAdmin) {
    const error = ApiResponse.forbidden("Super admin access required");
    return res.status(error.status).json(error);
  }
  next();
};