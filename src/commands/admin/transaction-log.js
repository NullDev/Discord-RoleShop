import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "../../../config/config.js";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/transactions.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-transaction-log`)
        .setDescription("Send the current transaction log for this guild.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const log = await db.get(`guild-${interaction.guildId}`);
        if (!log || !log.length){
            return await interaction.followUp({
                content: "No transaction log found for this guild.",
            });
        }

        const maxLengths = log.reduce((max, entry) => {
            for (const key in entry){
                const {length} = String(entry[key]);
                max[key] = Math.max(length, max[key] || 0);
            }
            return max;
        }, {});

        const logString = log.map((entry) => {
            const date = new Date(entry.timestamp);
            return `[${date.toLocaleString()}] User: ${String(entry.userid).padEnd(maxLengths.userid)} - Action: ${String(entry.action).padEnd(maxLengths.action)} - RoleID: ${String(entry.roleid).padEnd(maxLengths.roleid)} - RoleName: ${String(entry.rolename).padEnd(maxLengths.rolename)} - Price: ${String(entry.price).padEnd(maxLengths.price)} - OldBalance: ${String(entry.oldBalance).padEnd(maxLengths.oldBalance)} - NewBalance: ${String(entry.newBalance).padEnd(maxLengths.newBalance)}`;
        }).join("\n");

        return await interaction.followUp({
            content: "Transaction log:",
            files: [{
                attachment: Buffer.from(logString),
                name: "transaction-log.txt",
            }],
        });
    },
};
