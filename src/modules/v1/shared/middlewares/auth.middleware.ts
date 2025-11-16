import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { HTTP_RESPONSE } from "../../../../utils/HttpResponse";
import { AuthRequest } from "../../../../types/auth.types";

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    const error = HTTP_RESPONSE.UNAUTHORIZED("Authorization token required");
    return res.status(error.status).json(error);
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (err) {
    const error = HTTP_RESPONSE.FORBIDDEN("Invalid or expired token");
    return res.status(error.status).json(error);
  }
}

function globalAdminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.isGlobalAdmin) {
    const error = HTTP_RESPONSE.FORBIDDEN("Global admin access required");
    return res.status(error.status).json(error);
  }
  next();
}

function tenantAdminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user?.tenantId) {
    const error = HTTP_RESPONSE.FORBIDDEN("Tenant access required");
    return res.status(error.status).json(error);
  }
  next();
}

export { authMiddleware, globalAdminOnly, tenantAdminOnly };
export { superAdminOnly } from './superAdmin.middleware';