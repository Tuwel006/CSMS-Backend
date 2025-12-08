export interface CreateMatchDto {
    teamA: {
        name: string;
        short_name?: string;
        logo_url?: string;
        location?: string;
    };
    teamB: {
        name: string;
        short_name?: string;
        logo_url?: string;
        location?: string;
    };
    match_date: Date;
    format: string;
    venue: string;
    status: string;
}

export interface UpdateMatchDto {
    match_date?: Date;
    format?: string;
    venue?: string;
    status?: string;
    team_a_id?: number;
    team_b_id?: number;
}

export interface MatchResponseDto {
    id: number;
    team_a_id: number;
    team_b_id: number;
    match_date: Date;
    format: string;
    venue: string;
    status: string;
    is_active: boolean;
    tenant_id: number;
    createdAt: Date;
    updatedAt: Date;
}
