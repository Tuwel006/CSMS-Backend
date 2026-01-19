export interface LiveScorePayload {
  i: number;          // innings_id
  r: number;          // total runs
  w: number;          // wickets
  b: number;          // balls

  st: LiveBatsman;    // striker
  ns: LiveBatsman;    // non-striker

  ov: OverBall[];     // current over balls
}

export interface LiveBatsman {
  id: number;
  n: string;     // name
  r: number;     // runs
  b: number;     // balls
  4?: number;    // fours (optional)
  6?: number;    // sixes (optional)
}

export type OverBall = {
    type: string;   // type of ball
    r: number;      // runs scored on the ball
};

export interface LiveBowler {
  id: number;
  n: string;     // name
  b: number;     // balls bowled
  m: number;     // maidens
  r: number;     // runs
  w: number;     // wickets
  overs: OverBall[]; // balls bowled in current over
}