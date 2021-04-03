const { Client } = require("../dist/index.js");
require("dotenv").config();

const client = new Client();

client.on("authorize", () => {
  console.log("Bot online");
});

client.on("social.dm", (data) => {
  console.log("message received");
  client.socialDM(data.data.user, "dont message me D:<");
});

client.login(process.env.TOKEN);
