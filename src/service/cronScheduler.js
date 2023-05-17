import cron from "node-cron";
import Log from "../util/log.js";
import syncRolesAndShop from "../crons/syncRolesAndShop.js";

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

    const cronCount = cron.getTasks().size;
    Log.done("Scheduled " + cronCount + " Crons.");
};

export default scheduleCrons;
