const { Client } = require("../dist/index.js");
require("dotenv").config();

const client = new Client();

client.on("authorize", () => {
  console.log("Bot online");
});

client.on("social.invite", (data) => {
  client.room.join(data.roomid);
});

client.on("joinroom", () => {
  client.room.mode("player");
});

client.login(process.env.TOKEN);
