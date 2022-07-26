const { Client } = require("../dist/index");
const client = new Client();

client.on("err", (e) => {
  console.error(e);
});

client.on("ready", () => {
  console.log("Client Online.");

  // Join a room

  client.user.on("join", () => {
    client.user.room.on("bracket_swap", (player) => {
      if (player.user._id == client.user._id && player.bracket == "player")
        client.user.room.switchBracket("spectator");
    });

    client.user.room.on("leave", () => {
      if (client.user.room.players.length < 2) {
        client.user.leave();
        client.disconnect();
      }
    });

    let roomHost;
    client.user.room.on("host_switch", (host) => {
      if (host._id != client.user._id) return (roomHost = host);
      client.user.room.transferHost(roomHost);
    });
  });
});

client.login("YOUR-TOKEN-HERE");
