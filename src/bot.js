import { GatewayIntentBits, Events, ActivityType, Partials } from "discord.js";
import Log from "./util/log.js";
import RateLimiter from "./util/rateLimiter.js";
import { config } from "../config/config.js";
import DiscordClient from "./service/client.js";
import registerCommands from "./service/commandRegister.js";
import interactionCreateHandler from "./events/interactionCreate.js";
import messageCreate from "./events/messageCreate.js";
import voiceStateUpdate from "./events/voiceStateUpdate.js";
import scheduleCrons from "./service/cronScheduler.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const client = new DiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
    ],
    presence: {
        status: "dnd",
        activities: [{ name: "Starting...", type: ActivityType.Playing }],
    },
});

Log.wait("Starting bot...");

client.on(Events.ClientReady, async() => {
    Log.done("Bot is ready!");
    Log.info("Logged in as '" + client.user?.tag + "'! Serving in " + client.guilds.cache.size + " servers.");

    await registerCommands(client)
        .then(() => client.on(Events.InteractionCreate, async interaction => interactionCreateHandler(interaction)));

    await scheduleCrons(client);

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

client.on(Events.VoiceStateUpdate, async(oldState, newState) => voiceStateUpdate(oldState, newState));

client.on(Events.GuildCreate, guild => Log.info("Joined guild: " + guild.name));

client.on(Events.GuildDelete, guild => Log.info("Left guild: " + guild.name));

client.on(Events.GuildUnavailable, guild => Log.warn("Guild is unavailable: " + guild.name));

client.on(Events.Warn, info => Log.warn(info));

client.on(Events.Error, err => Log.error("Client error.", err));

client.login(config.discord.bot_token)
    .then(() => Log.done("Logged in!"))
    .catch(err => Log.error("Failed to login: ", err));

process.on("unhandledRejection", (
    /** @type {Error} */ err,
) => Log.error("Unhandled promise rejection: ", err));
