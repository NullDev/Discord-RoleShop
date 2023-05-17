import cron from "node-cron";
import Log from "../util/log.js";
import removeInteractionComponents from "../crons/removeInteractionComponents.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const scheduleCrons = function(client){
    // 10 minutes cron
    cron.schedule("*/10 * * * *", () => {
        removeInteractionComponents(client);
    });

    // hourly cron
    cron.schedule("0 * * * *", () => {
    });

    const cronCount = cron.getTasks().size;
    Log.done("Scheduled " + cronCount + " Crons.");
};

export default scheduleCrons;
