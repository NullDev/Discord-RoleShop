import { GatewayIntentBits, Events, ActivityType } from "discord.js";
import Log from "./util/log.js";
import RateLimiter from "./util/rateLimiter.js";
import translationCheck from "./util/translationCheck.js";
import { config } from "../config/config.js";
import DiscordClient from "./service/client.js";
import registerCommands from "./service/commandRegister.js";
import interactionCreateHandler from "./events/interactionCreate.js";
import messageCreate from "./events/messageCreate.js";
import scheduleCrons from "./service/cronScheduler.js";

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

Log.wait("Starting bot...");

Log.wait("Checking locales...");
if (await translationCheck()) Log.done("Locales are in sync!");
else {
    Log.error("Locales are not in sync!");
    process.exit(1);
}

client.on(Events.ClientReady, async() => {
    Log.done("Bot is ready!");
    Log.info("Logged in as '" + client.user?.tag + "'! Serving in " + client.guilds.cache.size + " servers.");

    await registerCommands(client)
        .then(() => client.on(Events.InteractionCreate, async interaction => interactionCreateHandler(interaction)));

    scheduleCrons(client);

    client.user?.setActivity({ name: config.discord.bot_status, type: ActivityType.Playing });
    client.user?.setStatus("online");
});

// Alpha: 0.4 - Smoothing factor
// Window: 10 - Sliding window size
const rateLimiter = new RateLimiter(
    config.bot_settings.spam_filter.alpha,
    config.bot_settings.spam_filter.window,
);

client.on(Events.MessageCreate, async message => messageCreate(message, rateLimiter));

client.on(Events.Warn, info => Log.warn(info));

client.on(Events.Error, err => Log.error("Client error.", err));

client.login(config.discord.bot_token)
    .then(() => Log.done("Logged in!"))
    .catch(err => Log.error("Failed to login: ", err));

process.on("unhandledRejection", (
    /** @type {Error} */ err,
) => Log.error("Unhandled promise rejection: ", err));
