export interface CreatePlayerDto {
  full_name: string;
  role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
  user_id?: number;
}

export interface UpdatePlayerDto {
  full_name?: string;
  role?: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
  user_id?: number;
}
