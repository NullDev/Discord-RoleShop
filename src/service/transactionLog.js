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
 * @param {String} roleid
 * @param {String} rolename
 * @param {String} action
 * @param {Number|null} [price=null]
 */
const logTransaction = async function(guildid, userid, roleid, rolename, action, price = null){
    const timestamp = (new Date()).toISOString();
    await db.push(`guild-${guildid}`, {
        timestamp, userid, roleid, rolename, action, price,
    });
};

export default logTransaction;
