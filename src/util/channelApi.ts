import {
  APIResponse,
  GeneralActivityType,
  GeneralStatsType,
  UserInfoType,
  UserRecordsType,
  UserSearchType,
} from "./types";

const cacheSessionID = `SESS-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

const cache: Map<string, any> = new Map();

export default async function channelApi(
  endpoint: string,
  method = "GET",
  body?: any
): Promise<APIResponse> {
  if (method == "GET" && !body) {
    let cacheData = cache.get(endpoint);
    if (!!cacheData) {
      cacheData = await Promise.resolve(cacheData);
      if (cacheData.success && new Date().getTime() < cacheData.cache.cached_until)
        return cacheData.data;
    }
  }
  let response: Promise<APIResponse> = fetch(`https://ch.tetr.io/api${encodeURI(endpoint)}`, {
    method,
    body,
    headers: {
      Accept: "application/json",
      "X-Session-ID": cacheSessionID,
    },
  }).then((res) => res.json());
  cache.set(endpoint, response);

  if (!(await response).success) throw Error((await response).error);

  return (await response).data;
}

/**
 * @description Some statistics about the service.
 * @returns {Promise<GeneralStatsType>}
 */
function generalStats(): Promise<GeneralStatsType> {
  return channelApi("/general/stats");
}

/**
 * @description A graph of user activity over the last 2 days. A user is seen as active if they logged in or received XP within the last 30 minutes.
 * @returns {Promise<GeneralActivityType>}
 */
function generalActivity(): Promise<GeneralActivityType> {
  return channelApi("/general/activity");
}

/**
 * @description An object describing the user in detail.
 * @param {string} user The username or user ID to look up.
 * @returns {Promise<UserInfoType>}
 */
function userInfo(user: string): Promise<UserInfoType> {
  return channelApi("/users/" + user.toLowerCase()).then((x) => x.user);
}

/**
 * @description An object describing the user in detail.
 * @param {string} user The username or user ID to look up.
 * @returns {Promise<UserRecordsType>}
 */
function userRecords(user: string): Promise<UserRecordsType> {
  return channelApi("/users/" + user.toLowerCase() + "/records");
}

/**
 * @description An object describing the user found, or undefined if none found.
 * @param {string} query The Discord ID (snowflake) to look up.
 * @returns {Promise<UserSearchType>}
 */
function userSearch(query: string): Promise<UserSearchType | undefined> {
  return channelApi("/users/search/" + query).then((x) => x.user ?? undefined);
}

const general = {
  stats: generalStats,
  activity: generalActivity,
};

const users = {
  info: userInfo,
  records: userRecords,
  search: userSearch,
};

export const TetraChannel = {
  general,
  users,
  cache,
};
