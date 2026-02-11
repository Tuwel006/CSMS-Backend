export interface LiveScorePayload {
  i: number;                    // innings_id
  is_completed: boolean;        // innings completed
  innings_number: number;       // innings number
  battingTeam: string;          // batting team short name
  bowlingTeam: string;          // bowling team short name

  score: {
    r: number;                  // runs
    w: number;                  // wickets
    b: number;                  // balls
  };

  batting: {
    striker: LiveBatsman | null;
    nonStriker: LiveBatsman | null;
  };

  dismissed: DismissedBatsman[];

  bowling: LiveBowler[];

  currentOver: {
    o: number;                  // over number
    isOverComplete: boolean;
    bowlerId: number | null;
    ballsCount: number;
    illegalBallsCount: number;
    balls: BallDetail[];
  };
}

export interface LiveBatsman {
  id: number;
  n: string;                    // name
  r: number;                    // runs
  b: number;                    // balls
  '4s': number;                 // fours
  '6s': number;                 // sixes
  sr: string;                   // strike rate
}

export interface DismissedBatsman {
  id: number;
  n: string;                    // name
  r: number;                    // runs
  b: number;                    // balls
  w: {
    type: string | null;
    bowler: string | null;
    fielder: string | null;
  };
  o: number | null;             // dismissal over
}

export interface LiveBowler {
  id: number;
  n: string;                    // name
  b: number;                    // balls bowled
  r: number;                    // runs
  w: number;                    // wickets
  e: string;                    // economy
}

export interface BallDetail {
  b: number;                    // ball number
  t: string;                    // ball type
  r: number | string;           // runs or 'W' for wicket
}

export type OverBall = {
  type: string;                 // type of ball
  r: number;                    // runs scored on the ball
};