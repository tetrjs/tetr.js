export type recordType = {
  /** The Record's ID. This is **NOT** the replay ID. */
  _id: string;
  /** The Stream this Record belongs to. */
  stream: string;
  /** The ID of the associated replay. */
  replayid: string;

  /** The user who set this Record: */
  user: {
    /**The user's internal ID. */
    _id: string;
    /** The user's username. */
    username: string;
  };

  /** The time this record was set. */
  ts: string;
  /** If true, this is a multiplayer replay. */
  ismulti?: boolean;
  /** The state this replay finished with. */
  endcontext:
    | {
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
      }
    | Record<any, any>;
};

export type userRecordsType = {
  /** The requested user's ranked records: */
  records: {
    /** The user's 40 LINES record: */
    "40l": {
      /** The user's 40 LINES record data, or null if never played. */
      record: recordType | null;
      /** The user's rank in global leaderboards, or null if not in global leaderboards. */
      rank: number | null;
    };

    /** The user's BLITZ record: */
    blitz: {
      /** The user's BLITZ record data, or null if never played. */
      record: recordType | null;
      /** The user's rank in global BLITZ leaderboards, or null if not in global leaderboards. */
      rank: number | null;
    };
  };
  /** The user's ZEN record: */
  zen: {
    /** The user's level in ZEN mode. */
    level: number;
    /** The user's score in ZEN mode. */
    score: number;
  };
};

// TODO
export type NewsRecordsType = unknown;
