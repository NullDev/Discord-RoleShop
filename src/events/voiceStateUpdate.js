import path from "node:path";
import { QuickDB } from "quick.db";
import VoiceCount from "../service/voiceCountService";
// import { config } from "../../config/config.js";
// import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const usersDb = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
});

const voiceCount = new VoiceCount();

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

    // @TODO: Mute/Unmute counts as voiceStateUpdate so we need to
    // track this event as well and update newState accordingly!

    // Also: Take into account deafen/muted/muted by admin/defenead by admin!

    if (!oldState.channel && newState.channel){
        voiceCount.start(guild, oldState.member, newState);
    }

    else if (oldState.channel && !newState.channel){
        voiceCount.stop(guild, oldState.member);
    }
};

export default voiceStateUpdate;
