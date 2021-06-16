const { Client } = require("./../dist/index");
const main = new Client();
const START_DELAY = 5000;

main.once("ready", () => {
  console.log("Client Online.");

  main.user.on("invite", (invite) => {
    console.log(`Joining ${invite.room.name}`);

    const client = new Client();

    client.once("ready", () => {
      client.user.join(invite.room.id);

      client.user.once("join", () => {
        let timeOut;
        client.user.room.on("host_switch", () => {
          checkStart();
        });

        client.user.room.on("join", () => {
          ValidStart();
        });

        client.user.room.on("leave", () => {
          ValidStart();
        });

        client.user.room.on("bracket_swap", () => {
          ValidStart();
        });

        client.user.room.on("end", () => {
          ValidStart();
        });

        function checkStart() {
          if (
            !client.user.room.inGame &&
            client.user.room.players.filter((p) => p.mode === "playing")
              .length >= 2 &&
            client.user._id === client.user.room.owner._id
          ) {
            if (timeOut) return;

            client.user.room.send(
              `New game starting in ${START_DELAY / 1000} seconds.`
            );

            timeOut = setTimeout(() => {
              client.user.room.send("Game Starting.");
              client.user.room.startRoom();
              timeOut = undefined;
            }, START_DELAY);
          } else {
            if (timeOut) {
              clearTimeout(timeOut);
              timeOut = undefined;

              client.user.room.send(
                "Cleared countdown. Room doesn't fit requirements to start."
              );
            }
          }
        }
      });
    });
  });

  main.user.on("join", () => {
    console.log(`Joined ${client.user.room.config.meta.name}`);
  });
});

main.login("YOUR-TOKEN-HERE");
