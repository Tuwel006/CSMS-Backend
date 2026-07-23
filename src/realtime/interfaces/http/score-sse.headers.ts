/**
 * Standard SSE response headers + CORS handling.
 *
 * Centralized so the score SSE handler can stay focused on subscription and
 * event flow.
 */

import type { Request, Response } from 'express';

const ALLOWED_ORIGINS = [
  'http://localhost:5000',
  'http://localhost:5173',
  'http://127.0.0.1:5000',
] as const;

export function applySseHeaders(req: Request, res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable nginx buffering

  const requestOrigin = req.headers.origin;
  const fallback = process.env.CLIENT_URL || 'http://localhost:5173';
  const origin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin as any)
    ? requestOrigin
    : fallback;

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.flushHeaders();
}
