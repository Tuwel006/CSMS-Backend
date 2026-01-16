export interface CreateTenantDto {
  organizationName: string;
  planId: number;
}

export interface UpdateTenantDto {
  name?: string;
  planId?: number;
}

export interface TenantDashboardDto {
  id: number;
  name: string;
  planId: number | null;
  plan?: {
    id: number;
    name: string;
    maxMatches: number | null;
    maxTournaments: number | null;
    maxUsers: number | null;
  };
  usage: {
    currentMatches: number;
    currentTournaments: number;
    currentUsers: number;
  };
  createdAt: Date;
}