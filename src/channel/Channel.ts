import fetch from "node-fetch";
import type * as types from "./ChannelTypes";

/**
 * @description Some statistics about the service.
 * @returns {Promise<types.generalStatsType>}
 */

async function generalStats() /*: Promise<types.generalStatsType>*/ {
  return await (await fetch("https://ch.tetr.io/api/general/stats")).json();
}

/**
 * @description A graph of user activity over the last 2 days. A user is seen as active if they logged in or received XP within the last 30 minutes.
 * @returns {Promise<types.activityStatsType>}
 */

async function generalActivity(): Promise<types.activityStatsType> {
  return await (await fetch("https://ch.tetr.io/api/general/activity")).json();
}

/**
 * @description An object describing the user in detail.
 * @param {string} user The username of the user.
 * @returns {Promise<types.userInfosType>}
 */

async function userInfos(user: string): Promise<types.userInfosType> {
  return await (
    await fetch(encodeURI("https://ch.tetr.io/api/users/" + user.toLowerCase()))
  ).json();
}

/**
 * @description An object describing the user in detail.
 * @param {string} user The username of the user.
 * @returns {Promise<types.UserRecordsType>}
 */

async function userRecords(user: string): Promise<types.userInfosType> {
  return await (
    await fetch(
      encodeURI(
        "https://ch.tetr.io/api/users/" + user.toLowerCase() + "/records"
      )
    )
  ).json();
}

/**
 * @description An array of users fulfilling the search criteria.
 * @param {string} country
 * @param {object} params
 * @returns {Promise<types.LeaderboardType>}
 */

async function TL_Leaderboard(
  country?: string,
  params?: {
    after?: number;
    before?: number;
    limit?: number;
  }
): Promise<types.LeaderboardType> {
  var url = new URL("https://ch.tetr.io/api/users/lists/league?");
  if (params || country) {
    var settings: object = { ...params, country };
    Object.keys(settings).forEach((key, index) =>
      url.searchParams.append(key, Object.values(settings)[index])
    );
  }
  return await (await fetch(url)).json();
}

/**
 * @description An array of all users fulfilling the search criteria. Please do not overuse this.
 * @param {string} country
 * @param {object} params
 * @returns {Promise<types.LeaderboardType>}
 */

async function TL_Leaderboard_full(
  country?: string
): Promise<types.LeaderboardType> {
  var url = new URL("https://ch.tetr.io/api/users/lists/league/all?");
  if (country) {
      url.searchParams.append("country", country)
  }
  return await (
    await await fetch(url)
  ).json();
}

/**
 * @description An array of users fulfilling the search criteria.
 * @param {string} country
 * @param {object} params
 * @returns {Promise<types.LeaderboardType>}
 */

async function XP_Leaderboard(
  country?: string,
  params?: {
    after?: number;
    before?: number;
    limit?: number;
  }
): Promise<types.LeaderboardType> {
  var url = new URL("https://ch.tetr.io/api/users/lists/xp?");
  if (params || country) {
    var settings: object = { ...params, country };
    Object.keys(settings).forEach((key, index) =>
      url.searchParams.append(key, Object.values(settings)[index])
    );
  }
  return await (await fetch(url)).json();
}

/**
 * The records in this Stream. A Stream is a list of records with a set length. Replays that are not featured in any Stream are automatically pruned.
 * @param {string} stream
 * @returns {Promise<types.StreamType>}
 */

async function stream(stream: string): Promise<types.StreamType> {
  return await (
    await fetch(encodeURI("https://ch.tetr.io/api/streams/" + stream.toLowerCase()))
  ).json();
}

/**
 * The latest news items in any stream.
 * @param {number} limit
 * @returns {Promise<types.NewsListType>}
 */

async function all_news(limit?: number): Promise<types.NewsListType> {
  return await (
    await await fetch(
      encodeURI(
        "https://ch.tetr.io/api/news?" + limit
          ? `limit=${limit}`
          : ""
      )
    )
  ).json();
}

/**
 * The latest news items in the stream. Use stream "global" for the global news.
 * @param {string} stream
 * @param {number} limit
 * @returns {Promise<types.NewsListType>}
 */

async function news(
  stream: string,
  limit?: number
): Promise<types.NewsListType> {
  return await (
    await await fetch(
      encodeURI(
        "https://ch.tetr.io/api/news/" + stream + "?" + limit
          ? `limit=${limit}`
          : ""
      )
    )
  ).json();
}

var general = {
  stats: generalStats,
  activity: generalActivity,
};

var users = {
  infos: userInfos,
  records: userRecords,
};

var leaderboards = {
  tetra_league: TL_Leaderboard,
  tetra_league_full: TL_Leaderboard_full,
  xp: XP_Leaderboard,
};

var misc = {
  stream,
  all_news,
  news,
};

export var TetraChannel = {
  general,
  users,
  leaderboards,
  misc,
};
