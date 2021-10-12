import fetch from "node-fetch";
import { CacheData } from "..";
import type * as types from "./ChannelTypes";

const cacheSessionID = `SESS-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

/**
 * The User cache
 * @type {Map<string, CacheData>}
 */
const cache: Map<string, CacheData> = new Map();

/**
 * Checks if a cache value is filled
 * @param {string} key The key of the cache
 * @returns {CacheData | void}
 */
function checkCache(key: string) {
  const cacheData = cache.get(key);
  if (!!cacheData && new Date().getTime() < cacheData.cache.cached_until) return cacheData.data;
}

/**
 * @description Some statistics about the service.
 * @returns {Promise<types.generalStatsType>}
 */
async function generalStats(): Promise<types.generalStatsType> {
  const cacheData = checkCache("generalStats");
  if (cacheData) return cacheData;

  const data = await (
    await fetch("https://ch.tetr.io/api/general/stats", {
      headers: { "X-Session-ID": cacheSessionID },
    })
  ).json();
  if (!data.success) throw new Error(data.error);

  cache.set("generalStats", data);
  return data.data;
}

/**
 * @description A graph of user activity over the last 2 days. A user is seen as active if they logged in or received XP within the last 30 minutes.
 * @returns {Promise<types.activityStatsType>}
 */
async function generalActivity(): Promise<types.activityStatsType> {
  const cacheData = checkCache("generalActivity");
  if (cacheData) return cacheData;

  const data = await (
    await fetch("https://ch.tetr.io/api/general/activity", {
      headers: { "X-Session-ID": cacheSessionID },
    })
  ).json();
  if (!data.success) throw new Error(data.error);

  cache.set("generalActivity", data);
  return data.data;
}

/**
 * @description An object describing the user in detail.
 * @param {string} user The username of the user.
 * @returns {Promise<types.userInfosType>}
 */
async function userInfos(user: string): Promise<types.userInfosType> {
  const cacheData = checkCache(`user_${user}`);
  if (cacheData) return cacheData;

  const data = await (
    await fetch(encodeURI("https://ch.tetr.io/api/users/" + user.toLowerCase()))
  ).json();

  if (!data.success) throw new Error(data.error);

  cache.set(`user_${user}`, data);
  return data.data.user;
}

/**
 * @description An object describing the user in detail.
 * @param {string} user The username of the user.
 * @returns {Promise<types.userRecordsType>}
 */
async function userRecords(user: string): Promise<types.userRecordsType> {
  const cacheData = checkCache(`userRecords_${user}`);
  if (cacheData) return cacheData;

  const data = await (
    await fetch(encodeURI("https://ch.tetr.io/api/users/" + user.toLowerCase() + "/records"), {
      headers: { "X-Session-ID": cacheSessionID },
    })
  ).json();

  if (!data.success) throw new Error(data.error);

  cache.set(`userRecords_${user}`, data);
  return data.data;
}

/**
 * @description An array of users fulfilling the search criteria.
 * @param {object} options
 * @returns {Promise<types.TL_Leaderboard_UserInfoType[]>}
 */
async function TL_Leaderboard(options?: {
  country?: string;
  after?: number;
  before?: number;
  limit?: number;
}): Promise<types.TL_Leaderboard_UserInfoType[]> {
  const url = new URL("https://ch.tetr.io/api/users/lists/league?");
  if (options) {
    for (const option in options) {
      url.searchParams.append(
        option,
        (options[option as keyof typeof options] as string | number).toString()
      );
    }
  }

  const cacheString = `TL_Leaderboard${
    options
      ? (options.country ? "_" + options.country : "") +
        (options.after ? "_" + options.after : "") +
        (options.before ? "_" + options.before : "") +
        (options.limit ? "_" + options.limit : "")
      : ""
  }`;

  const cacheData = checkCache(cacheString);
  if (cacheData) return cacheData;

  const data = await (
    await fetch(url, {
      headers: { "X-Session-ID": cacheSessionID },
    })
  ).json();

  if (!data.success) throw new Error(data.error);

  cache.set(cacheString, data);
  return data.data.users;
}

/**
 * @description An array of all users fulfilling the search criteria. Please do not overuse this.
 * @param {string} country
 * @returns {Promise<types.TL_Leaderboard_UserInfoType[]>}
 */
async function TL_Leaderboard_full(country?: string): Promise<types.TL_Leaderboard_UserInfoType[]> {
  const cacheData = checkCache(`TL_Leaderboard_full${country ? "_" + country : ""}`);
  if (cacheData) return cacheData;

  const data = await (
    await fetch(
      encodeURI(
        `https://ch.tetr.io/api/users/lists/league/all?${country ? `country=${country}` : ""}`
      ),
      {
        headers: { "X-Session-ID": cacheSessionID },
      }
    )
  ).json();

  if (!data.success) throw new Error(data.error);

  cache.set(`TL_Leaderboard_full${country ? "_" + country : ""}`, data);
  return data.data.users;
}

/**
 * @description An array of users fulfilling the search criteria.
 * @param {object} options
 * @returns {Promise<types.XP_Leaderboard_UserInfoType[]>}
 */
async function XP_Leaderboard(options?: {
  country?: string;
  after?: number;
  before?: number;
  limit?: number;
}): Promise<types.XP_Leaderboard_UserInfoType[]> {
  const url = new URL("https://ch.tetr.io/api/users/lists/xp?");
  if (options) {
    for (const option in options) {
      url.searchParams.append(
        option,
        (options[option as keyof typeof options] as string | number).toString()
      );
    }
  }

  const cacheString = `XP_Leaderboard${
    options
      ? (options.country ? "_" + options.country : "") +
        (options.after ? "_" + options.after : "") +
        (options.before ? "_" + options.before : "") +
        (options.limit ? "_" + options.limit : "")
      : ""
  }`;

  const cacheData = checkCache(cacheString);
  if (cacheData) return cacheData;

  const data = await (
    await fetch(url, {
      headers: { "X-Session-ID": cacheSessionID },
    })
  ).json();

  if (!data.success) throw new Error(data.error);

  cache.set(cacheString, data);
  return data.data.users;
}

/**
 * The records in this Stream. A Stream is a list of records with a set length. Replays that are not featured in any Stream are automatically pruned.
 * @param {types.streamID} stream The stream ID to look up.
 * @returns {Promise<types.recordType[]>}
 */
async function stream(stream: types.streamID): Promise<types.recordType[]> {
  const cacheData = checkCache(`stream_${stream}`);
  if (cacheData) return cacheData;

  const data = await (
    await fetch(encodeURI("https://ch.tetr.io/api/streams/" + stream.toLowerCase()), {
      headers: { "X-Session-ID": cacheSessionID },
    })
  ).json();

  if (!data.success) throw new Error(data.error);

  cache.set(`stream_${stream}`, data);
  return data.data.records;
}

/**
 * The latest news items in any stream.
 * @param {number} limit The amount of entries to return, between 1 and 100. 25 by default.
 * @returns {Promise<types.NewsType[]>}
 */

async function all_news(limit?: number): Promise<types.NewsType[]> {
  return (
    await (
      await fetch(encodeURI(`https://ch.tetr.io/api/news?${limit ? `limit=${limit}` : ""}`))
    ).json()
  ).data.news;
}

/**
 * The latest news items in the stream. Use stream "global" for the global news.
 * @param {types.streamID} stream The news stream to look up (either "global" or "user_{ userID }").
 * @param {number} limit The amount of entries to return, between 1 and 100. 25 by default.
 * @returns {Promise<NewsType[]>}
 */

async function news(stream: types.streamID, limit?: number): Promise<types.NewsType[]> {
  const cacheData = checkCache(`news_${stream}${limit ? "_" + limit : ""}`);
  if (cacheData) return cacheData;

  const data = await (
    await fetch(
      encodeURI(`https://ch.tetr.io/api/news/${stream}?${limit ? `limit=${limit}` : ""}`),
      {
        headers: { "X-Session-ID": cacheSessionID },
      }
    )
  ).json();

  if (!data.success) throw new Error(data.error);

  cache.set(`news_${stream}${limit ? "_" + limit : ""}`, data);
  return data.data.news;
}

const general = {
  stats: generalStats,
  activity: generalActivity,
};

const users = {
  infos: userInfos,
  records: userRecords,
};

const leaderboards = {
  tetra_league: TL_Leaderboard,
  tetra_league_full: TL_Leaderboard_full,
  xp: XP_Leaderboard,
};

const misc = {
  stream,
  all_news,
  news,
};

export const TetraChannel = {
  general,
  users,
  leaderboards,
  misc,
  cache,
};
