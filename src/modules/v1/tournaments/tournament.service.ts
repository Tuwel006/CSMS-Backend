import { AppDataSource } from '../../../config/db';
import { Tournament } from '../shared/entities/Tournament';

export class TournamentService {
  static async createTournament(data: Partial<Tournament>): Promise<Tournament> {
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const newTournament = tournamentRepository.create(data);
    return await tournamentRepository.save(newTournament);
  }

  static async getTournaments(): Promise<Tournament[]> {
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    return await tournamentRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  static async getTournamentById(id: string): Promise<Tournament | null> {
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    return await tournamentRepository.findOne({ where: { id } });
  }

  static async updateTournament(id: string, data: Partial<Tournament>): Promise<Tournament | null> {
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const tournament = await tournamentRepository.findOne({ where: { id } });
    if (!tournament) {
      return null;
    }
    
    tournamentRepository.merge(tournament, data);
    return await tournamentRepository.save(tournament);
  }

  static async deleteTournament(id: string): Promise<boolean> {
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const tournament = await tournamentRepository.findOne({ where: { id } });
    if (!tournament) {
      return false;
    }
    await tournamentRepository.remove(tournament);
    return true;
  }
}
