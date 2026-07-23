/**
 * Express controller helpers — standardize response shape via ApiResponse
 * and remove try/catch boilerplate from every controller method.
 *
 * Pattern in controllers:
 *   static async create(req, res) {
 *     try {
 *       const data = await Service.create(...);
 *       sendCreated(res, data, 'Created');
 *     } catch (error) {
 *       sendMappedError(res, error);
 *     }
 *   }
 */

import { Response } from 'express';
import { ApiResponse } from './ApiResponse';
import { HTTP_STATUS } from '../constants/status-codes';
import { AuthRequest } from '../types/auth.types';

// --- Success responses ---

export function sendSuccess(res: Response, data: any, message = 'Success') {
  const response = ApiResponse.success(data, message);
  res.status(response.status).json(response);
}

export function sendCreated(res: Response, data: any, message = 'Created successfully') {
  const response = ApiResponse.created(data, message);
  res.status(response.status).json(response);
}

// --- Raw payload passthrough (legacy endpoints returning non-ApiResponse shapes) ---

export function sendRaw(res: Response, data: any, status = 200) {
  res.status(status).json(data);
}

// --- Error responses ---

/**
 * Map a thrown error (with optional .status and .message) to the
 * appropriate ApiResponse. Use this in catch blocks so all errors
 * across the app flow through one shape.
 */
export function sendMappedError(res: Response, error: any) {
  const status = error?.status || HTTP_STATUS.BAD_REQUEST;
  const message = error?.message || 'Internal Server Error';

  let response;
  switch (status) {
    case HTTP_STATUS.NOT_FOUND:
      response = ApiResponse.notFound(message);
      break;
    case HTTP_STATUS.BAD_REQUEST:
      response = ApiResponse.badRequest(message);
      break;
    case HTTP_STATUS.UNAUTHORIZED:
      response = ApiResponse.unauthorized(message);
      break;
    case HTTP_STATUS.FORBIDDEN:
      response = ApiResponse.forbidden(message);
      break;
    default:
      response = ApiResponse.serverError(message);
  }

  res.status(response.status).json(response);
}

/**
 * Extract tenantId from the authenticated request, or return a 403 response.
 * Returns the tenantId on success, or null and writes the error response.
 */
export function requireTenantId(
  req: AuthRequest,
  res: Response
): number | null {
  const tenantId = req.user?.tenantId;
  if (!tenantId) {
    const response = ApiResponse.forbidden('Tenant ID is required');
    res.status(response.status).json(response);
    return null;
  }
  return tenantId;
}

/**
 * Extract user ID from the authenticated request, or return a 403 response.
 */
export function requireUserId(
  req: AuthRequest,
  res: Response
): number | null {
  const userId = req.user?.id;
  if (!userId) {
    const response = ApiResponse.forbidden('User ID is required');
    res.status(response.status).json(response);
    return null;
  }
  return userId;
}

/**
 * Parse a query-string integer with default fallback.
 */
export function parseIntQuery(value: any, fallback: number): number {
  const parsed = parseInt(value as string);
  return Number.isFinite(parsed) ? parsed : fallback;
}