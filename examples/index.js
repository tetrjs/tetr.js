const { Client } = require("../dist/index");

require("dotenv").config();

const client = new Client();

client.on("ready", () => {
  console.log("Client Online.");
});

client.login(process.env.TOKEN);
