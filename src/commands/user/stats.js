import path from "node:path";
import { SlashCommandBuilder } from "discord.js";
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
        .setName(`${config.bot_settings.slash_command_prefix}-stats`)
        .setDescription("Shows your or another users stats.")
        .setDMPermission(false)
        .addUserOption((option) =>
            option.setName("user")
                .setDescription("The user to show stats for")
                .setRequired(false)),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const user = interaction.options.get("user");
        if (user?.user?.bot) return await interaction.reply({
            content: await __("errors.stats_on_bot")(interaction.guildId),
            ephemeral: true,
        });

        const userid = user?.user?.id || interaction.user.id;
        const pointsKey = `guild-${interaction.guildId}.user-${userid}.points`;

        const points = await db.get(pointsKey) || 0;

        if (!user?.user?.id){
            return await interaction.reply(await __(
                "replies.stats_you",
                await __("replies.points", points, points)(interaction.guildId, true),
            )(interaction.guildId));
        }
        return await interaction.reply(await __(
            "replies.stats_other",
            user.user.tag,
            await __("replies.points", points, points)(interaction.guildId, true),
        )(interaction.guildId));
    },
};
