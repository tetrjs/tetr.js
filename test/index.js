const { Client } = require("../dist/index.js");
require("dotenv").config();
const { inspect } = require("util");

const client = new Client();

client.on("authorize", () => {
  console.log("Bot online");

  client.social.presence({ status: "away", detail: "" });
});

client.on("social.dm", (message) => {
  if (message.data.content.startsWith("!eval")) {
    try {
      eval(message.data.content.slice(6));
      client.social.message(
        message.data.user,
        inspect(message.data.content.slice(6))
      );
    } catch (e) {
      client.social.message(message.data.user, e);
    }
  }
});

client.login(process.env.TOKEN);
