import { Response } from "express";

class SSEManager {
    private static instance: SSEManager;
    private clients: Map<string, Set<Response>> = new Map();

    private constructor() {}

    public static getInstance(): SSEManager {
        if (!SSEManager.instance) {
            SSEManager.instance = new SSEManager();
        }
        return SSEManager.instance;
    }

    public addClient(matchId: string, res: Response): void {
        if (!this.clients.has(matchId)) {
            this.clients.set(matchId, new Set());
        }
        this.clients.get(matchId)!.add(res);
    }

    public removeClient(matchId: string, res: Response): void {
        if (this.clients.has(matchId)) {
            this.clients.get(matchId)!.delete(res);
        }
    }

    public broadcast(matchId: string, event: string, data: any): void {
        const payload = `event: ${event} \ndata: ${JSON.stringify(data)}\n\n`;
        if (this.clients.has(matchId)) {
            this.clients.get(matchId)!.forEach(res => {
                res.write(payload);
            });
        }
    }
}

export const sseManager = SSEManager.getInstance();