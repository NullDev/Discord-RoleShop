import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/* eslint-disable curly */

const db = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-unban`)
        .setDescription(translations.unban.desc)
        .setDescriptionLocalizations(translations.unban.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) =>
            option.setName("user")
                .setDescription(translations.unban.options.user.desc)
                .setDescriptionLocalizations(translations.unban.options.user.translations)
                .setRequired(true)),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const user = interaction.options.get("user");
        if (!user?.user?.id) return await interaction.reply({
            content: await __("errors.invalid_user")(interaction.guildId),
            ephemeral: true,
        });

        const isBanned = await db.get(`guild-${interaction.guildId}.user-${user?.user?.id}.banned`);
        if (!isBanned){
            return await interaction.reply({
                content: await __("errors.user_not_banned")(interaction.guildId),
                ephemeral: true,
            });
        }

        await db.delete(`guild-${interaction.guildId}.user-${user?.user?.id}.banned`);

        return await interaction.reply({
            content: await __("replies.user_unbanned", user?.user?.tag)(interaction.guildId),
            ephemeral: true,
        });
    },
};
