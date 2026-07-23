export interface TeamSetupDto {
  matchId: string;
  team: {
    id?: number;
    name: string;
    location?: string;
  };
  players: Array<{
    id?: number;
    name: string;
    role: string;
  }>;
}
