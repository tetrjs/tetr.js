const { Client } = require("../dist/index");
const client = new Client();

client.on("ready", () => {
  console.log("Client Online.");

  client.user.on("invite", (invite) => {
    console.log(`Joining ${invite.room.name}`);

    client.user.join(invite.room.id);
  });

  client.user.on("join", () => {
    console.log(`Joined ${client.user.room.config.meta.name}`);
  });
});

client.login("YOUR-TOKEN-HERE");
