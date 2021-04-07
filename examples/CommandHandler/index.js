const TOKEN = "YOUR TOKEN HERE";

const { Client } = require("tetr.js");
const client = new Client();
const fs = require("fs");

const prefix = "."; // Command prefix
const cmdDir = "./commands/"; // Directory for command files

const cmdList = new Map();
const cooldowns = new Map();

const cmds = fs
  .readdirSync(`${cmdDir}`)
  .filter((files) => files.endsWith(".js")); // Finds commands in the command directory

for (const file of cmds) {
  const cmd = require(cmdDir + file);
  cmdList.set(file.toLowerCase(), cmd); // Load commands to command list
  console.log(`Loaded Command: ${cmd.info.name}`);
}

client.on("ready", () => {
  console.log("Client Online");
});

client.on("message", (message) => {
  const system = message.system;
  const user = message.user;

  const reply = (message) => client.room.message(message);

  if (user.role == "bot" || system) return; // Check if user is bot or system

  if (!message.content.toLowerCase().startsWith(prefix)) return; // Check if message starts with prefix
  const args = message.content.slice(prefix.length).trim().split(/\s+/); // Get command args

  const commandName = args.shift().toLowerCase();
  const command = cmdList.get(commandName); // Find command from command list

  if (!command) return; // If doesn't exist, return

  try {
    console.log(`${user.username} (${user.id}) executed ${command.info.name}`);
    command.execute(reply, client, message, args); // Execute the command
  } catch (error) {
    console.error(
      `${user.username} (${user.id}) tried to execute ${command.info.name}, but an error occurred: ${error}`
    );
    reply("There was an error trying to execute that command!");
  }
});

client.login(TOKEN);
