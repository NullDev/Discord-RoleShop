import path from "node:path";
import fs from "node:fs/promises";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Get date from filename
 *
 * @param {string} filename
 * @return {Date | null}
 */
const getDateFromFilename = function(filename){
    // Format: roleshop-DD-MM-YYYY-output.log and roleshop-DD-MM-YYYY-errors.log
    const regex = /(\d{2})-(\d{2})-(\d{4})/;
    const match = filename.match(regex);

    if (match){
        const day = Number(match[1]);
        const month = Number(match[2]);
        const year = Number(match[3]);

        const date = new Date(year, month - 1, day);

        return date;
    }
    return null;
};

/**
 * Remove logs that are older than 7 days
 */
const removeOldLogs = async() => {
    Log.wait("[CRON] Deleting old logs...");

    let deletedLogs = 0;

    const logDir = path.resolve("./logs");
    const eLogDir = path.resolve("./logs/errors");

    const logs = (await fs.readdir(logDir)).filter(f => f.endsWith(".log")).map(f => path.resolve(logDir, f));
    const eLogs = (await fs.readdir(eLogDir)).filter(f => f.endsWith(".log")).map(f => path.resolve(eLogDir, f));

    const allLogs = [...logs, ...eLogs];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await Promise.all(allLogs.map(async f => {
        const fileDateFromName = getDateFromFilename(f);

        if (!fileDateFromName || fileDateFromName < sevenDaysAgo){
            // await fs.unlink(f).catch(e => Log.error(`[CRON] Could not remove old log ${f}`, e));
            Log.done(`[CRON] Removed old log ${f}.`);
            ++deletedLogs;
        }
    }));

    Log.done(`[CRON] Removed ${deletedLogs} old log${deletedLogs === 1 ? "" : "s"}.`);
};

export default removeOldLogs;
