import cron from "node-cron";
import Log from "../util/log.js";
import syncRolesAndShop from "../crons/syncRolesAndShop.js";
import removeOldLogs from "../crons/removeOldLogs.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Schedule all crons
 *
 * @param {import("../service/client.js").default} client
 */
const scheduleCrons = function(client){
    // hourly cron
    cron.schedule("0 * * * *", () => {
        syncRolesAndShop(client);
    });

    // daily cron
    cron.schedule("0 0 * * *", () => {
        removeOldLogs();
    });

    const cronCount = cron.getTasks().size;
    Log.done("Scheduled " + cronCount + " Crons.");

    // start jobs on init
    syncRolesAndShop(client);
    removeOldLogs();
};

export default scheduleCrons;
