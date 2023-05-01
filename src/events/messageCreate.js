import path from "node:path";
import { QuickDB } from "quick.db";
import { config } from "../../config/config.js";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
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

    const pointsKey = `guild-${guild}.user-${user}.points`;

    const currentPoints = await db.get(pointsKey) || 0;
    const boosterMultiplier = message.member?.premiumSinceTimestamp ? config.bot_settings.booster_multiplier : 1;

    await db.set(pointsKey, currentPoints + boosterMultiplier);
};

export default messageCreate;
