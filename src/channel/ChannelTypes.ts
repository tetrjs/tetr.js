export type cache = {
  status: string;
  cached_at: number;
  cached_until: number;
};

export type generalStatsType = {
  success: boolean;
  error?: string;
  data?: {
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
  cache?: cache;
};

export type activityStatsType = {
  success: boolean;
  error?: string;
  data?: {
    activity: number[];
  };
  cache?: cache;
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
  success: boolean;
  error?: string;
  data?: {
    user: {
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
  };
  cache?: cache;
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

export type UserRecordsType = {
  success: boolean;
  error?: string;
  data?: {
    records: {
      "40l": recordType;
      blitz: recordType;
    };
    zen: {
      level: number;
      score: number;
    };
  };
  cache?: cache;
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

export type LeaderboardType = {
  success: boolean;
  error?: string;
  data?: {
    users: Leaderboard_UserInfoType[];
  };
  cache?: cache;
};

export type StreamType = {
  success: boolean;
  error?: string;
  data?: {
    records: UserRecordsType[];
  };
  cache?: cache;
};

export type NewsType = {
  _id: string;
  stream: string;
  type: string;
  data: recordType;
  ts: string;
};

export type NewsListType = {
  success: boolean;
  error?: string;
  data?: {
    news: NewsType[];
  };
  cache?: cache;
};
