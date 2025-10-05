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

export interface TeamListResponseDto {
  teams: TeamResponseDto[];
  total: number;
  page: number;
  limit: number;
}