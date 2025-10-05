import { AppDataSource } from '../../../config/db';
import { Score } from './entities/test';

async function insertBalls() {
    const repo = AppDataSource.getRepository(Score);

    const scores1 = repo.create([
    { match_id: 2, innings_no: 1 },
    ]);
    await repo.save(scores1);
    const scores2 = repo.create([
    { match_id: 3, innings_no: 1 },
    ]);
    await repo.save(scores2);

    await repo.save(scores1);
    const scores3 = repo.create([
    { match_id: 1, innings_no: 1 },
    ]);
    await repo.save(scores3);

    await repo.save(scores1);
    const scores4 = repo.create([
    { match_id: 2, innings_no: 1 },
    ]);
    await repo.save(scores4);

    console.log("Inserted scores with balls set by hook:");
    console.log( await repo.find());
}
export { insertBalls };