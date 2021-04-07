module.exports.execute = async (reply, client, message, args) => {
  reply(`Hello ${message.user.username}`);
};
