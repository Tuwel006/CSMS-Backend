export interface CreateTeamDto {
  name: string;
  short_name: string;
  logo_url?: string;
  location?: string;
}

export interface UpdateTeamDto {
  name?: string;
  short_name?: string;
  logo_url?: string;
  location?: string;
}

export interface TeamResponseDto {
  id: number;
  name: string;
  short_name: string;
  logo_url: string | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetTeamsQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  searchBy?: 'name' | 'short_name' | 'location';
  sort?: 'ASC' | 'DESC';
  sortBy?: 'name' | 'short_name' | 'location' | 'createdAt';
}

export interface TeamListResponseDto {
  data: TeamResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}