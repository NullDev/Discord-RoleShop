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
    filePath: path.resolve("./data/roles.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-list-roles`)
        .setDescription(translations.list_roles.desc)
        .setDescriptionLocalizations(translations.list_roles.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const roles = await db.get(`guild-${interaction.guildId}`);
        if (!roles || Object.keys(roles).length === 0){
            return await interaction.reply({
                content: await __("errors.no_roles")(interaction.guildId),
                ephemeral: true,
            });
        }

        const promises = Object.entries(roles).map(async([roleid, price]) => {
            const role = (await interaction.guild?.roles.fetch(roleid))?.name;
            if (!role){
                await db.delete(`guild-${interaction.guildId}.${roleid}`);
                return await __("errors.role_not_found", roleid, price)(interaction.guildId);
            }
            return `**${role}** - ${price} points`;
        });

        const replyString = (await Promise.all(promises)).join("\n");

        return await interaction.reply({
            content: replyString,
            ephemeral: true,
        });
    },
};
