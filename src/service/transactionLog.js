import path from "node:path";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/* eslint-disable camelcase */

const db = new QuickDB({
    filePath: path.resolve("./data/transactions.sqlite"),
});

/**
 * Log a transaction to the database
 *
 * @param {import("discord.js").Guild} guild
 * @param {import("discord.js").GuildMember} user
 * @param {import("discord.js").Role} role
 * @param {String} action
 * @param {Number|null} [price=null]
 * @param {Number|null} [balance_before=null]
 * @param {Number|null} [balance_after=null]
 */
const logTransaction = async function(guild, user, role, action, price = null, balance_before = null, balance_after = null){
    // TABLE GUILD -> TIMESTAMP | USERID | ROLEID | ROLENAME | ACTION | PRICE | BALANCE_BEFORE | BALANCE_AFTER
    const UTCTimestamp = Date.now();
    const userid = user.id;
    const roleid = role.id;
    const rolename = role.name;

    await db.push(`guild-${guild.id}`, {
        timestamp: UTCTimestamp, userid, roleid, rolename, action, price, balance_before, balance_after,
    });
};

export default logTransaction;
