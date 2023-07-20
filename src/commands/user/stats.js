import path from "node:path";
import { SlashCommandBuilder } from "discord.js";
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
        case 404: return " Error: Points not found."
        case 420: return " <:420:1113774775203012689>";
        case 666: return " :smiling_imp:";
        case 1337: return " N1C3 0N3 :sunglasses:";
        case 9001: return " IT'S OVER 9000!!! <:AAHHH:1044205696738131978>";
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

        const isBanned = await db.get(`guild-${interaction.guildId}.user-${userid}.banned`);
        if (!!isBanned){
            return await interaction.reply(await __("replies.stats_banned")(interaction.guildId));
        }

        if (!user?.user?.id){
            return await interaction.reply(await __(
                "replies.stats_you",
                await __("replies.points", points, points)(interaction.guildId, true),
            )(interaction.guildId) + context);
        }
        return await interaction.reply(await __(
            "replies.stats_other",
            user.user.tag,
            await __("replies.points", points, points)(interaction.guildId, true),
        )(interaction.guildId) + context);
    },
};
