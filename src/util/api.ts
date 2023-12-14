import { APIResponse } from "./types";

export default async function (
  endpoint: string,
  token?: string,
  headers_ = {},
  method = "GET",
  body_?: any
): Promise<APIResponse> {
  let headers: any = {
    Accept: "application/json",
    ...headers_,
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  let response: APIResponse = await (
    await fetch(`https://tetr.io/api${endpoint}`, {
      method,
      body: body_ ? Buffer.from(JSON.stringify(body_)) : undefined,
      headers,
    })
  ).json();

  if (!response.success) throw Error(response.error.msg);

  return response;
}
