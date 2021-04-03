const { Client } = require("tetr.js");

const client = new Client();

client.on("ready", () => {
  console.log("Client Online.");
});

client.on("social_invite", (data) => {
  client.joinRoom(data.room);
});

client.login("YOUR CLIENT TOKEN HERE");
