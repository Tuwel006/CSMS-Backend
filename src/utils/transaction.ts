/**
 * TypeORM transaction wrapper. Opens a query runner, runs the handler
 * inside a transaction, commits on success, rolls back on any thrown error,
 * and always releases the runner.
 *
 * Usage:
 *   const result = await runInTransaction(async (manager) => {
 *     const repo = manager.getRepository(MyEntity);
 *     return await repo.save(...);
 *   });
 */

import { EntityManager } from 'typeorm';
import { AppDataSource } from '../config/db';

export async function runInTransaction<T>(
  handler: (manager: EntityManager) => Promise<T>
): Promise<T> {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const result = await handler(queryRunner.manager);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}