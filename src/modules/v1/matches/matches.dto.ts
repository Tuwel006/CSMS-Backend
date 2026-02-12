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

export interface MatchStartDto {
    toss_winner_team_id: number;
    batting_first_team_id: number;
    over: number;
    teamA: {
        id: number;
        playing_11_id: number[];
        captain_id: number;
    };
    teamB: {
        id: number;
        playing_11_id: number[];
        captain_id: number;
    }
}

export interface RecordBallDto {
    ball_type: string;
    runs?: number;
    batsman_id: number;
    bowler_id: number;
    is_wicket?: boolean;
    is_boundary?: boolean;
    by_runs?: number;
    wicket?: {
        wicket_type?: string;
        bowler_id?: number;
        fielder_id?: number;
        out_batsman_id?: number;
    };
    innings_id: number;
    batting_team_id: number;
    bowling_team_id: number;
    over_number: number;
    ball_number: number;
    should_flip_striker?: boolean;
    is_over_complete?: boolean;
}

export interface GetMatchesQueryDto {
    page?: number;
    limit?: number;
    status?: string;
    sorted?: string;
    sorted_order?: 'ASC' | 'DESC';
}

export interface SwitchInningsDto {
    isFollowOn: boolean;
}
