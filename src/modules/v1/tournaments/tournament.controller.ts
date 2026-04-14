import { Request, Response } from 'express';
import { TournamentService } from './tournament.service';

export class TournamentController {
  static async createTournament(req: Request, res: Response): Promise<void> {
    try {
      const saved = await TournamentService.createTournament(req.body);
      res.status(201).json({ message: 'Tournament created successfully', data: saved });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create tournament', details: error.message });
    }
  }

  static async getTournaments(req: Request, res: Response): Promise<void> {
    try {
      const tournaments = await TournamentService.getTournaments();
      res.status(200).json({ data: tournaments });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch tournaments', details: error.message });
    }
  }

  static async getTournamentById(req: Request, res: Response): Promise<void> {
    try {
      const tournament = await TournamentService.getTournamentById(req.params.id);
      if (!tournament) {
        res.status(404).json({ error: 'Tournament not found' });
        return;
      }
      res.status(200).json({ data: tournament });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch tournament', details: error.message });
    }
  }

  static async updateTournament(req: Request, res: Response): Promise<void> {
    try {
      const updated = await TournamentService.updateTournament(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Tournament not found' });
        return;
      }
      
      res.status(200).json({ message: 'Tournament updated successfully', data: updated });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update tournament', details: error.message });
    }
  }

  static async deleteTournament(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await TournamentService.deleteTournament(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Tournament not found' });
        return;
      }
      res.status(200).json({ message: 'Tournament deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete tournament', details: error.message });
    }
  }
}
