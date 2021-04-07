module.exports.execute = async (reply, client, message, args) => {
  if (message.user.id == client.room.host.id) {
    reply("Leaving the room!");
    client.leaveRoom();
  }
};
