import path from "node:path";
import { QuickDB } from "quick.db";
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
};

export default messageCreate;
