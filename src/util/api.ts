import { APIResponse } from "./types";

const cache: Map<string, { expire: number; data: any }> = new Map();

export default async function (
  endpoint: string,
  token?: string,
  headers_ = {},
  method = "GET",
  body_?: any,
  cache_?: {
    expire: number;
    key: string;
  }
): Promise<APIResponse> {
  if (cache_) {
    let cacheData: any = cache.get(cache_.key);
    if (!!cacheData) {
      if (new Date().getTime() < cacheData.expire) {
        cacheData = await Promise.resolve(cacheData.data);
        if (cacheData.success) return cacheData;
      }
    }
  }

  let headers: any = {
    Accept: "application/json",
    ...headers_,
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  let response: Promise<APIResponse> = fetch(`https://tetr.io/api${endpoint}`, {
    method,
    body: body_ ? Buffer.from(JSON.stringify(body_)) : undefined,
    headers,
  }).then((res) => res.json());

  if (cache_) cache.set(cache_.key, { expire: cache_.expire, data: response });

  if (!(await response).success) throw Error((await response).error.msg);

  return await response;
}
