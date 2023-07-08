import path from "node:path";
import { QuickDB } from "quick.db";
// import { config } from "../../config/config.js";
// import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const usersDb = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
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

    if (!oldState.channel && newState.channel){
        console.log(`User ${user} joined voice channel ${newState.channel.id} on server ${guild}`);
    }

    else if (oldState.channel && !newState.channel){
        console.log(`User ${user} left voice channel ${oldState.channel.id} on server ${guild}`);
    }
};

export default voiceStateUpdate;
