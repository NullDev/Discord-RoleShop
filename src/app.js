import { GatewayIntentBits, Events, ActivityType } from "discord.js";
import Log from "./util/log.js";
import RateLimiter from "./util/rateLimiter.js";
import { config, meta } from "../config/config.js";
import DiscordClient from "./service/client.js";
import registerCommands from "./service/commandRegister.js";
import interactionCreateHandler from "./events/interactionCreate.js";
import messageCreate from "./events/messageCreate.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const client = new DiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
    presence: {
        status: "dnd",
        activities: [{ name: "Starting...", type: ActivityType.Playing }],
    },
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

Log.debug("Node Environment: " + process.env.NODE_ENV, true);
Log.debug("NodeJS version: " + process.version, true);
Log.debug("OS: " + process.platform + " " + process.arch, true);

Log.wait("Starting bot...");

client.on("ready", async() => {
    Log.done("Bot is ready!");
    Log.info("Logged in as '" + client.user?.tag + "'! Serving in " + client.guilds.cache.size + " servers.");

    await registerCommands(client)
        .then(() => client.on(Events.InteractionCreate, async interaction => interactionCreateHandler(interaction)));

    client.user?.setActivity({ name: config.discord.bot_status, type: ActivityType.Playing });
    client.user?.setStatus("online");
});

// Alpha: 0.4 - Smoothing factor
// Window: 10 - Sliding window size
const rateLimiter = new RateLimiter(
    config.bot_settings.spam_filter.alpha,
    config.bot_settings.spam_filter.window,
);

client.on("messageCreate", async message => messageCreate(message, rateLimiter));

client.on("warn", info => Log.warn(info));

client.on("error", err => Log.error("Client error.", err));

client.login(config.discord.bot_token)
    .then(() => Log.done("Logged in!"))
    .catch(err => Log.error("Failed to login: " + err));

process.on("unhandledRejection", (promise, reason) => Log.error("Unhandled promise rejection: " + promise + " reason: " + reason));
