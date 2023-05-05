import path from "node:path";
import { QuickDB } from "quick.db";
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
 * Handle messageCreate event
 *
 * @param {import("discord.js").Message} message
 * @return {Promise<void>}
 */
const messageCreate = async function(message){
    if (message.author.bot) return;

    const guild = message.guild?.id;
    const user = message.author.id;

    if (!guild || !user){
        Log.error("Could not get guild or user id", new Error());
        return;
    }

    const multiplierKey = `guild-${guild}.boost-multiplier`;
    const multiplier = Number(await guildSettingsDb.get(multiplierKey)) || 1;
    console.log(multiplier);
    const pointsKey = `guild-${guild}.user-${user}.points`;
    const pointsToAdd = message.member?.premiumSinceTimestamp ? multiplier : 1;

    await usersDb.add(pointsKey, pointsToAdd);
};

export default messageCreate;
