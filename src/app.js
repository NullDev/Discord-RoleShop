import { Client, GatewayIntentBits } from "discord.js";
import Log from "./util/log.js";
import { config, meta } from "../config/config.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const appname = meta.getName();
const version = meta.getVersion();
const author = meta.getAuthor();
const pad = 16 + appname.length + version.toString().length + author.length;

console.log(
    "\n" +
    " #" + "-".repeat(pad) + "#\n" +
    " # Started " + appname + " v" + version + " by " + author + " #\n" +
    " #" + "-".repeat(pad) + "#\n",
);

Log.info("Starting bot...");

client.on("ready", () => {
    Log.info("Bot is ready!");
    client.user.setActivity(config.discord.bot_status);
});

client.login(config.discord.bot_token)
    .then(() => Log.info("Logged in!"))
    .catch(err => Log.error("Failed to login: " + err));
