export interface TeamAssignmentDto {
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
