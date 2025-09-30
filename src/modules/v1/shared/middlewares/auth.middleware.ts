import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../../utils/ApiResponse";

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    isGlobalAdmin: boolean;
    tenantId: number | null;
  };
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    const error = ApiResponse.unauthorized("Authorization token required");
    return res.status(error.status).json(error);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (err) {
    const error = ApiResponse.forbidden("Invalid or expired token");
    return res.status(error.status).json(error);
  }
}

function globalAdminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.isGlobalAdmin) {
    const error = ApiResponse.forbidden("Global admin access required");
    return res.status(error.status).json(error);
  }
  next();
}

function tenantAdminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.tenantId) {
    const error = ApiResponse.forbidden("Tenant access required");
    return res.status(error.status).json(error);
  }
  next();
}

export { authMiddleware, globalAdminOnly, tenantAdminOnly };