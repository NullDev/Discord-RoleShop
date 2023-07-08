import path from "node:path";
import { QuickDB } from "quick.db";
import { config } from "../../config/config.js";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const usersDb = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
});

const guildSettingsDb = new QuickDB({
    filePath: path.resolve("./data/guild_settings.sqlite"),
});

/**
 * Handle voiceStateUpdate event
 *
 * @param {import("discord.js").VoiceState} oldState
 * @param {import("discord.js").VoiceState} newState
 * @return {Promise<void>}
 */
const voiceStateUpdate = async function(oldState, newState){
    const guild = oldState.guild.id;
    const user = oldState.member?.id;

    const isBanned = await usersDb.get(`guild-${guild}.user-${user}.banned`);
    if (!user || !!isBanned) return;

    // if user joined a voice channel on the server
};

export default voiceStateUpdate;
