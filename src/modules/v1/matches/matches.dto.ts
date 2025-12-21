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
    ball_type: string; // 'NORMAL', 'WIDE', 'NO_BALL', 'BYE', 'LEG_BYE', 'DOT'
    runs: number;
    batsman_id: number;
    bowler_id: number;
    is_wicket?: boolean;
    wicket_type?: string; // 'BOWLED', 'CAUGHT', 'LBW', 'RUN_OUT', 'STUMPED'
    is_boundary?: boolean;
}
