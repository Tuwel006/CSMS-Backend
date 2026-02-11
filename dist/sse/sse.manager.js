"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sseManager = void 0;
class SSEManager {
    constructor() {
        this.clients = new Map();
    }
    static getInstance() {
        if (!SSEManager.instance) {
            SSEManager.instance = new SSEManager();
        }
        return SSEManager.instance;
    }
    addClient(matchId, res) {
        if (!this.clients.has(matchId)) {
            this.clients.set(matchId, new Set());
        }
        this.clients.get(matchId).add(res);
    }
    removeClient(matchId, res) {
        if (this.clients.has(matchId)) {
            this.clients.get(matchId).delete(res);
        }
    }
    broadcast(matchId, event, data) {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        if (this.clients.has(matchId)) {
            this.clients.get(matchId).forEach(res => {
                res.write(payload);
            });
        }
    }
}
exports.sseManager = SSEManager.getInstance();
