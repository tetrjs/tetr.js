const TOKEN = "YOUR TOKEN HERE";
const START_DELAY = 20000;

const { Client } = require("tetr.js");

const client = new Client();

client.on("ready", () => {
  console.log("Client Online.");
});

client.on("social_invite", (data) => {
  const c = new Client();
  var host = "";

  c.on("ready", () => {
    c.joinRoom(data.room);
  });

  c.on("join", () => {
    host = c.room.host.id;
  });

  c.on("host_switch", (user) => {
    if (user.id !== client.user.id) host = user.id;

    ValidStart();
  });

  c.on("message", (message) => {
    if (message.content.toLowerCase() === "!leave" && message.user.id === host)
      c.room.leaveRoom();
  });

  c.on("player_join", () => {
    ValidStart();
  });

  c.on("player_leave", () => {
    ValidStart();
  });

  c.on("switch_mode", () => {
    ValidStart();
  });

  c.on("room_end", () => {
    ValidStart();
  });

  function ValidStart() {
    if (
      !c.room.gameStarted &&
      c.room.players.filter((p) => p.mode === "player").length >= 2 &&
      c.user.id === c.room.host.id
    ) {
      if (to) return;
      c.room.message(`New game starting in ${START_DELAY / 1000} seconds.`);
      to = setTimeout(() => {
        c.room.message("Game Starting.");
        c.room.startRoom();
        to = undefined;
      }, START_DELAY);
    } else {
      if (to) {
        clearTimeout(to);
        to = undefined;
        c.room.message("Cleared countdown. Not enough players to start.");
      }
    }
  }

  c.login(TOKEN);
});

client.login(TOKEN);
