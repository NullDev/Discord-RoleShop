import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "../../../config/config.js";
import { QuickDB } from "quick.db";
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
        .setName(`${config.bot_settings.slash_command_prefix}-remove-role`)
        .setDescription(translations.remove_role.desc)
        .setDescriptionLocalizations(translations.remove_role.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option.setName("name")
                .setDescription(translations.remove_role.options.name.desc)
                .setDescriptionLocalizations(translations.remove_role.options.name.translations)
                .setRequired(true),
        ).addBooleanOption((option) =>
            option.setName("delete")
                .setDescription(translations.remove_role.options.delete.desc)
                .setDescriptionLocalizations(translations.remove_role.options.delete.translations)
                .setRequired(true),
        ),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const name = String(interaction.options.get("name")?.value);
        if (!name){
            return await interaction.reply({
                content: await __("replies.remove_role.invalid_role_name")(interaction.guildId),
                ephemeral: true,
            });
        }

        const del = Boolean(interaction.options.get("delete")?.value || false);

        const role = interaction.guild?.roles.cache.find((r) => r.name === name);
        if (!role){
            return await interaction.reply({
                content: await __("replies.remove_role.role_not_found", name)(interaction.guildId),
                ephemeral: true,
            });
        }

        await db.delete(`guild-${interaction.guildId}.${role?.id}`);

        if (del){
            await role.delete().catch(async() => {
                return interaction.reply({
                    content: await __("replies.remove_role.failed_to_remove", name)(interaction.guildId),
                    ephemeral: true,
                });
            });
        }

        return await interaction.reply({
            content: del
                ? await __("replies.remove_role.removed_server", name)(interaction.guildId)
                : await __("replies.remove_role.removed", name)(interaction.guildId),
            ephemeral: true,
        });
    },
};
