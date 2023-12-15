import { APIResponse } from "./types";

export default async function (
  endpoint: string,
  method = "GET",
  body?: any
): Promise<APIResponse> {
  let response: APIResponse = await (
    await fetch(`https://ch.tetr.io/api${endpoint}`, {
      method,
      body,
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if (!response.success) throw Error(response.error);

  return response.data;
}
