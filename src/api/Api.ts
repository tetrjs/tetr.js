import fetch from "node-fetch";
import https from "https";
import * as msgpackr from "msgpackr";
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

const getTimeMS = (hrTime: [number, number]) => {
  return hrTime[0] * 1000 + hrTime[1] / 1000000;
};

export default class Api {
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
  public async getOptimalSpool(spools: {
    success: true;
    endpoint: string;
    spools: {
      token: string;
      spools: {
        name: string;
        host: string;
        flag: string;
      }[];
    };
  }) {
    const spoolData = (
      (
        await Promise.all(
          spools.spools.spools.map(
            (spool, index) =>
              new Promise<{
                spool: {
                  name: string;
                  host: string;
                  flag: string;
                };
                ttfb: number;
                load: number[];
                version: number;
                flags: {
                  online: number;
                  avoidDueToHighLoad: number;
                  recentlyRestarted: number;
                  unused4: number;
                  unused5: number;
                  unused6: number;
                  unused7: number;
                  unused8: number;
                };
              } | void>((resolve, reject) => {
                let responseBodyStart: [number, number], tlsHandshake: [number, number];
                const req = https.get(
                  `https://${spool.host}/spool?${Date.now()}-${index}-${Math.floor(
                    1e6 * Math.random()
                  )}`,
                  (res) => {
                    let body = "";

                    res.once("data", () => {
                      responseBodyStart = process.hrtime();
                    });

                    res.on("data", (d) => {
                      body += d;
                    });

                    res.on("end", () => {
                      const binary = Buffer.from(body);
                      const version = binary[0];
                      const flags = {
                        online: binary[1] & 0b10000000,
                        avoidDueToHighLoad: binary[1] & 0b01000000,
                        recentlyRestarted: binary[1] & 0b00100000,
                        unused4: binary[1] & 0b00010000,
                        unused5: binary[1] & 0b00001000,
                        unused6: binary[1] & 0b00000100,
                        unused7: binary[1] & 0b00000010,
                        unused8: binary[1] & 0b00000001,
                      };
                      const load = [0, 0, 0];

                      load[0] = (binary[2] / 0x100) * 4;
                      load[1] = (binary[3] / 0x100) * 4;
                      load[2] = (binary[4] / 0x100) * 4;

                      if (!flags.online) resolve();

                      resolve({
                        spool,
                        ttfb: getTimeMS(responseBodyStart) - getTimeMS(tlsHandshake),
                        load,
                        version,
                        flags,
                      });
                    });
                  }
                );

                req.on("error", (error) => {
                  resolve();
                });

                req.on("socket", (socket) => {
                  socket.on("secureConnect", () => {
                    tlsHandshake = process.hrtime();
                  });
                });

                req.end();
              })
          )
        )
      ).filter((val) => !!val) as {
        spool: {
          name: string;
          host: string;
          flag: string;
        };
        ttfb: number;
        load: number[];
        version: number;
        flags: {
          online: number;
          avoidDueToHighLoad: number;
          recentlyRestarted: number;
          unused4: number;
          unused5: number;
          unused6: number;
          unused7: number;
          unused8: number;
        };
      }[]
    ).sort((a, b) => a.ttfb - b.ttfb);
    if (!spoolData.length) throw new Error("Couldn't find a valid spool.");
    return spoolData[0];
  }

  public async getSpoolToken() {
    return (await this.get({ url: "/api/server/ribbon" })).spools.token;
  }
}
