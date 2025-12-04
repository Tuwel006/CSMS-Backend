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

export interface PlayerResponseDto {
  id: number;
  full_name: string;
  role: string;
  user_id: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerListResponseDto {
  data: PlayerResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetPlayersQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
  sort?: 'ASC' | 'DESC';
  sortBy?: 'full_name' | 'role' | 'createdAt';
}
