import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/transactions.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-transaction-log`)
        .setDescription(translations.transaction_log.desc)
        .setDescriptionLocalizations(translations.transaction_log.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const log = await db.get(`guild-${interaction.guildId}`);
        if (!log || !log.length){
            return await interaction.followUp({
                content: await __("errors.transaction_log_empty")(interaction.guildId),
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
