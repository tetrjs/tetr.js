import { APIResponse } from "./types";

const cacheSessionID = `SESS-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

const cache: Map<string, any> = new Map();

export default async function (endpoint: string, method = "GET", body?: any): Promise<APIResponse> {
  if (method == "GET" && !body) {
    const cacheData = cache.get(endpoint);
    if (!!cacheData && new Date().getTime() < cacheData.cache.cached_until) return cacheData.data;
  }
  let response: APIResponse = await (
    await fetch(`https://ch.tetr.io/api${endpoint}`, {
      method,
      body,
      headers: {
        Accept: "application/json",
        "X-Session-ID": cacheSessionID,
      },
    })
  ).json();

  if (!response.success) throw Error(response.error);

  cache.set(endpoint, response);
  return response.data;
}
