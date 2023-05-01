import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
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
        .setDescription("Set the points of a user.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption((option) =>
            option.setName("user")
                .setDescription("The user to set the points for")
                .setRequired(true))
        .addIntegerOption((option) =>
            option.setName("points")
                .setDescription("The points to set")
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

        db.set(`guild-${interaction.guildId}.user-${user?.user?.id}.points`, points);

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
