export type generalStatsType = {
  usercount: number;
  usercount_delta: number;
  anoncount: number;
  rankedcount: number;
  replaycount: number;
  gamesplayed: number;
  gamesplayed_delta: number;
  gamesfinished: number;
  gametime: number;
  inputs: number;
  piecesplaced: number;
};

export type activityStatsType = {
  activity: number[];
};

export type LeagueInfosType = {
  gamesplayed: number;
  gameswon: number;
  rating: number;
  glicko: number;
  rd: number;
  rank: string;
  apm: number;
  pps: number;
  vs: number;
};

export type LeagueInfosFullType = {
  gamesplayed: number;
  gameswon: number;
  rating: number;
  glicko: number;
  rd: number;
  rank: string;
  apm: number;
  pps: number;
  vs: number;
  decaying: false;
  standing: number;
  percentile: number;
  standing_local: number;
  prev_rank: string;
  prev_at: number;
  next_rank: string;
  next_at: number;
  percentile_rank: number;
};

export type userInfosType = {
  _id: string;
  username: string;
  role: string;
  ts: string;
  badges: {
    id: string;
    label: string;
    ts: string;
  }[];
  xp: number;
  gamesplayed: number;
  gameswon: number;
  gametime: number;
  country: string;
  supporter_tier: number;
  verified: boolean;
  league: LeagueInfosFullType;
  avatar_revision: number;
  friend_count: number;
};

export type recordType = {
  record: {
    _id: string;
    stream: string;
    replayid: string;
    user: { _id: string; username: string };
    ts: string;
    endcontext: {
      seed: number;
      lines: number;
      level_lines: number;
      level_lines_needed: number;
      inputs: number;
      time: {
        start: number;
        zero: false;
        locked: false;
        prev: number;
        frameoffset: number;
      };
      score: number;
      zenlevel: number;
      zenprogress: number;
      level: number;
      combo: number;
      currentcombopower: number;
      topcombo: number;
      btb: number;
      topbtb: number;
      tspins: number;
      piecesplaced: number;
      clears: {
        singles: number;
        doubles: number;
        triples: number;
        quads: number;
        realtspins: number;
        minitspins: number;
        minitspinsingles: number;
        tspinsingles: number;
        minitspindoubles: number;
        tspindoubles: number;
        tspintriples: number;
        tspinquads: number;
        allclear: number;
      };
      garbage: {
        sent: number;
        received: number;
        attack: number;
        cleared: number;
      };
      kills: number;
      finesse: { combo: number; faults: number; perfectpieces: number };
      finalTime: number;
      gametype: string;
    };
    ismulti: false;
  };
  rank: number;
};

export type userRecordsType = {
  records: {
    "40l": recordType;
    blitz: recordType;
  };
  zen: {
    level: number;
    score: number;
  };
};

export type Leaderboard_UserInfoType = {
  _id: string;
  username: string;
  role: string;
  country: string;
  supporter: number;
  verified: boolean;
  league: LeagueInfosType;
};

export type NewsType = {
  _id: string;
  stream: string;
  type: string;
  data: recordType;
  ts: string;
};
