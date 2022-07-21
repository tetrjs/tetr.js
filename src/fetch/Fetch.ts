import fetch from "node-fetch";
import msgpackr from "msgpackr";
import { Client } from "..";

//@ts-ignore
msgpackr.addExtension({
  type: 1,
  read: (e) => (null === e ? { success: true } : { success: true, ...e }),
});
//@ts-ignore
msgpackr.addExtension({
  type: 2,
  read: (e) => (null === e ? { success: false } : { success: false, error: e }),
});

const packr = new msgpackr.Packr({ bundleStrings: !1 });
const unpackr = new msgpackr.Unpackr({ bundleStrings: !1 });

export default class Fetch {
  constructor(client: Client) {
    this.client = client;
  }

  /**
   * The Client Class
   * @type {Client}
   * @readonly
   */
  public client!: Client;

  public async get(opts: { url: string; headers?: Record<string, any>; authenticated?: boolean }) {
    const options = {
      authenticated: true,
      headers: {},
      ...opts,
    };

    const rawData = await (
      await fetch("https://tetr.io" + options.url, {
        headers: {
          Accept: "application/vnd.osk.theorypack",
          ...(options.authenticated && { Authorization: `Bearer ${this.client.token}` }),
          ...options.headers,
        },
      })
    ).arrayBuffer();
    return unpackr.unpack(Buffer.from(rawData));
  }
}
