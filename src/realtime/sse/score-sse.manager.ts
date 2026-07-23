/**
 * SSE client manager for live match score streams.
 * One singleton; tracks per-match subscribers so that score updates
 * can be broadcast to every connected client for that match.
 */

import { Response } from 'express';
import { LiveScorePayload } from '../types/score.type';

class SSEManager {
  private static instance: SSEManager;
  private clients: Map<string, Set<Response>> = new Map();

  private constructor() {}

  static getInstance(): SSEManager {
    if (!SSEManager.instance) {
      SSEManager.instance = new SSEManager();
    }
    return SSEManager.instance;
  }

  addClient(matchId: string, res: Response): void {
    if (!this.clients.has(matchId)) {
      this.clients.set(matchId, new Set());
    }
    this.clients.get(matchId)!.add(res);
  }

  removeClient(matchId: string, res: Response): void {
    this.clients.get(matchId)?.delete(res);
  }

  broadcast(matchId: string, event: string, data: LiveScorePayload): void {
    const subscribers = this.clients.get(matchId);
    if (!subscribers || subscribers.size === 0) return;

    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of subscribers) {
      res.write(payload);
    }
  }
}

export const sseManager = SSEManager.getInstance();