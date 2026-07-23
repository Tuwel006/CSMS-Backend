/**
 * In-memory IClientRegistry — tracks SSEClient instances per matchId.
 *
 * The registry is always per-process. Cross-node delivery is handled by
 * the IScoreChannel (Redis pub/sub); each node's registry handles only
 * the clients connected to that node.
 */

import {
  IClientRegistry,
  IScoreClient,
} from '../../../domain/ports/client-registry.port';
import { LiveScorePayload } from '../../../domain/entities/live-score.entity';
import { SseEventName } from '../../../domain/types/events.type';

export class SseClientRegistry implements IClientRegistry {
  private readonly clients = new Map<string, Set<IScoreClient>>();

  add(client: IScoreClient): void {
    let set = this.clients.get(client.matchId);
    if (!set) {
      set = new Set();
      this.clients.set(client.matchId, set);
    }
    set.add(client);
  }

  remove(client: IScoreClient): void {
    const set = this.clients.get(client.matchId);
    if (!set) return;
    set.delete(client);
    if (set.size === 0) this.clients.delete(client.matchId);
  }

  list(matchId: string): IScoreClient[] {
    const set = this.clients.get(matchId);
    return set ? Array.from(set) : [];
  }

  count(matchId?: string): number {
    if (matchId) return this.clients.get(matchId)?.size ?? 0;
    let total = 0;
    for (const set of this.clients.values()) total += set.size;
    return total;
  }

  broadcast(matchId: string, event: SseEventName, data: LiveScorePayload | string): void {
    const set = this.clients.get(matchId);
    if (!set || set.size === 0) return;

    // Snapshot to avoid mutation-during-iteration.
    for (const client of Array.from(set)) {
      client.write(event, data);
    }
  }
}
