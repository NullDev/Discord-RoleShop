import path from "node:path";
import { SlashCommandBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import DiscordUtils from "../../util/discordUtils.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/* eslint-disable curly */

const db = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
});

/**
 * Don't ask
 *
 * @param {number} points
 * @return {string}
 */
const getAdditionalContext = function(points){
    switch (points){
        case 0: return " :sob:";
        case 69: return " Nice. :smirk:";
        case 420: return " <:420:1113774775203012689>";
        case 666: return " :smiling_imp:";
        case 1337: return " N1C3 0N3 :sunglasses:";
        default: return "";
    }
};

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-stats`)
        .setDescription(translations.stats.desc)
        .setDescriptionLocalizations(translations.stats.translations)
        .setDMPermission(false)
        .addUserOption((option) =>
            option.setName("user")
                .setDescription(translations.stats.options.user.desc)
                .setDescriptionLocalizations(translations.stats.options.user.translations)
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
        const context = getAdditionalContext(Math.floor(points));

        const users = await db.get(`guild-${interaction.guildId}`);
        const topData = DiscordUtils.getTopUsers(users, 0);

        const index = topData.findIndex((entry) => entry[1] === userid);
        const rank = index + 1;

        if (!user?.user?.id){
            return await interaction.reply(await __(
                "replies.stats_you",
                rank,
                await __("replies.points", points, points)(interaction.guildId, true),
            )(interaction.guildId) + context);
        }
        const name = DiscordUtils.getUserName(user.user, true);
        return await interaction.reply(await __(
            "replies.stats_other",
            name,
            rank,
            name,
            await __("replies.points", rank, points, points)(interaction.guildId, true),
        )(interaction.guildId) + context);
    },
};
