import { Client } from "../src/index";
// import WebSocketManager from "../src/ws/WebsocketManager";

(async () => {
  const client = new Client();

  await client.login_password("username", "password");

  //   console.log(client.me?.user.avatarURL);
})();
