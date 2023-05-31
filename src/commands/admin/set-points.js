import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import logTransaction from "../../service/transactionLog.js";
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
        .setName(`${config.bot_settings.slash_command_prefix}-set-points`)
        .setDescription(translations.set_points.desc)
        .setDescriptionLocalizations(translations.set_points.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) =>
            option.setName("user")
                .setDescription(translations.set_points.options.user.desc)
                .setDescriptionLocalizations(translations.set_points.options.user.translations)
                .setRequired(true))
        .addIntegerOption((option) =>
            option.setName("points")
                .setDescription(translations.set_points.options.points.desc)
                .setDescriptionLocalizations(translations.set_points.options.points.translations)
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

        if (user?.user?.bot) return await interaction.reply({
            content: await __("errors.points_on_bot")(interaction.guildId),
            ephemeral: true,
        });

        const points = Number(interaction.options.get("points")?.value);
        if (isNaN(points) || points < 0) return await interaction.reply({
            content: await __("errors.invalid_points")(interaction.guildId),
            ephemeral: true,
        });

        const oldBalance = await db.get(`guild-${interaction.guildId}.user-${user?.user?.id}.points`);
        await db.set(`guild-${interaction.guildId}.user-${user?.user?.id}.points`, points);

        await logTransaction(interaction.guildId, interaction.user.id, "SET-POINTS", null, null, null, oldBalance || 0, points);

        return await interaction.reply({
            content: await __(
                "replies.points_set",
                user?.user?.tag,
                await __("replies.points", points, points)(interaction.guildId, true),
            )(interaction.guildId),
            ephemeral: true,
        });
    },
};
