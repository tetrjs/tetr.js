export type generalStatsType = {
  /** The amount of users on the server, including anonymous accounts. */
  usercount: number;
  /** The amount of users created a second (through the last minute). */
  usercount_delta: number;
  /** The amount of anonymous accounts on the server. */
  anoncount: number;
  /** The amount of ranked (visible in TETRA LEAGUE leaderboard) accounts on the server. */
  rankedcount: number;

  /** The amount of replays stored on the server. */
  replaycount: number;

  /** The amount of games played across all users, including both off- and online modes. */
  gamesplayed: number;
  /** The amount of games played a second (through the last minute). */
  gamesplayed_delta: number;

  /** The amount of games played across all users, including both off- and online modes, excluding games that were not completed (e.g. retries) */
  gamesfinished: number;
  /** The amount of seconds spent playing across all users, including both off- and online modes. */
  gametime: number;

  /** The amount of keys pressed across all users, including both off- and online modes. */
  inputs: number;
  /** The amount of pieces placed across all users, including both off- and online modes. */
  piecesplaced: number;
};

export type activityStatsType = {
  /** An array of plot points, newest points first. */
  activity: number[];
};

export type RoleType = "anon" | "user" | "bot" | "mod" | "admin";
