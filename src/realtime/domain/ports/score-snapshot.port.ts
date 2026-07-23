/**
 * Port: IScoreSnapshotBuilder.
 *
 * Builds a LiveScorePayload from the database for a given match/innings.
 * The default implementation lives in infrastructure/persistence/queries and
 * is backed by TypeORM; tests can substitute a fake.
 */

import { LiveScorePayload } from '../entities/live-score.entity';

export interface IScoreSnapshotBuilder {
  build(matchId: string, inningsId: number): Promise<LiveScorePayload>;
}
