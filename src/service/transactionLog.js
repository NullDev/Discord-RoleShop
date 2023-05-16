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
 * @param {String|null} guildid
 * @param {String} userid
 * @param {String|null} [action=null]
 * @param {String|null} [roleid=null]
 * @param {String|null} [rolename=null]
 * @param {Number|null} [price=null]
 * @param {Number|null} [oldBalance=null]
 * @param {Number|null} [newBalance=null]
 */
const logTransaction = async function(guildid, userid, action, roleid = null, rolename = null, price = null, oldBalance = null, newBalance = null){
    const timestamp = (new Date()).toISOString();
    await db.push(`guild-${guildid}`, {
        timestamp, userid, action, roleid, rolename, price, oldBalance, newBalance,
    });
};

export default logTransaction;
