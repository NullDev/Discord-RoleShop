import path from "node:path";
import { QuickDB } from "quick.db";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const rolesDb = new QuickDB({
    filePath: path.resolve("./data/roles.sqlite"),
});

/**
 * Schedule all crons
 *
 * @param {import("../service/client.js").default} client
 */
const syncRolesAndShop = async(client) => {
    Log.wait("[CRON] Syncing roles and shop...");

    let removedGuilds = 0;
    let removedRoles = 0;

    const data = await rolesDb.all();
    if (!data) return;

    for (const dbGuild of data){
        const guildId = dbGuild.id.replace("guild-", "");
        const roles = Object.keys(dbGuild.value);

        for (const roleId of roles){
            const guild = await client.guilds.fetch(guildId);
            if (!guild){
                await rolesDb.delete(`guild-${guildId}`);
                Log.info(`[CRON] Guild ${guildId} not found. Deleting from DB...`);
                ++removedGuilds;
                continue;
            }

            const role = await guild.roles.fetch(roleId).catch(() => null);
            if (!role){
                await rolesDb.delete(`guild-${guildId}.${roleId}`);
                ++removedRoles;
                Log.info(`[CRON] Role ${roleId} not found. Deleting from DB...`);
            }
        }
    }

    Log.done(`[CRON] Synced roles and shop. Removed ${removedGuilds} guilds and ${removedRoles} roles.`);
};

export default syncRolesAndShop;
