import { APIResponse } from "./types";

const cacheSessionID = `SESS-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;

const cache: Map<string, any> = new Map();

export default async function (endpoint: string, method = "GET", body?: any): Promise<APIResponse> {
  if (method == "GET" && !body) {
    let cacheData = cache.get(endpoint);
    if (!!cacheData) {
      cacheData = await Promise.resolve(cacheData);
      if (cacheData.success && new Date().getTime() < cacheData.cache.cached_until)
        return cacheData.data;
    }
  }
  let response: Promise<APIResponse> = fetch(`https://ch.tetr.io/api${endpoint}`, {
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
