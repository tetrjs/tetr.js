require("dotenv").config();
const assert = require("assert");
const { TetraChannel, Client } = require("../dist/index");

describe("Tetra Channel Tests:", async () => {
  describe("General:", async () => {
    it("Stats", async () => {
      const res = await TetraChannel.general.stats();

      assert(res);
    });

    it("Activity", async () => {
      const res = await TetraChannel.general.activity();

      assert(res);
    });
  });

  describe("Users:", async () => {
    const user = "proximitynow";

    it("Infos", async () => {
      const res = await TetraChannel.users.infos(user);

      assert(res);
    });

    it("Records", async () => {
      const res = await TetraChannel.users.records(user);

      assert(res);
    });
  });

  describe("Leaderboards:", async () => {
    it("Tetra League", async () => {
      const res = await TetraChannel.leaderboards.tetra_league();

      assert(res);
    });

    it("Tetra League Full", async () => {
      const res = await TetraChannel.leaderboards.tetra_league_full();

      assert(res);
    });

    it("XP", async () => {
      const res = await TetraChannel.leaderboards.xp();

      assert(res);
    });
  });

  describe("Misc:", async () => {
    it("Stream", async () => {
      const res = await TetraChannel.misc.stream("40l_global");

      assert(res);
    });

    it("All News", async () => {
      const res = await TetraChannel.misc.all_news();

      assert(res);
    });

    it("News", async () => {
      const res = await TetraChannel.misc.news("40l_global");

      assert(res);
    });
  });
});

if (process.env.TOKEN) {
  describe("Client Tests:", async () => {
    describe("Client:", async () => {
      const client = new Client();

      it("Logging In", async () => {
        return new Promise(async (resolve, reject) => {
          client.on("err", async (e) => {
            reject(e);
          });

          client.on("ready", async () => {
            resolve();
          });

          await client.login(process.env.TOKEN);
        });
      });

      it("Disconnect", () => {
        client.disconnect();
      });
    });
  });
} else {
  console.log("No token provided, skipping main client tests");
}
