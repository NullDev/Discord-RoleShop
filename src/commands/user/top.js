import path from "node:path";
import { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import DiscordUtils from "../../util/discordUtils.js";
import { config } from "../../../config/config.js";
import generateImage from "../../service/topImageGenerator.js";
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
        .setName(`${config.bot_settings.slash_command_prefix}-top`)
        .setDescription(translations.top.desc)
        .setDescriptionLocalizations(translations.top.translations)
        .setDMPermission(false),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const guildkey = `guild-${interaction.guildId}`;
        const users = await db.get(guildkey);

        if (!users) return await interaction.followUp(await __("errors.no_top_stats")(interaction.guildId));

        const top10 = Object.entries(users)
            .filter((user) => user[1].points > 0 && !user[1].banned)
            .sort((a, b) => b[1].points - a[1].points)
            .slice(0, 10)
            .map((user, index) => ([index + 1, user[0].split("-")[1], user[1].points]));

        if (!top10.length) return await interaction.followUp(await __("errors.no_top_stats")(interaction.guildId));

        const top10WithNames = await Promise.all(top10.map(async(user) => {
            const [index, userid, points] = user;

            const member = await interaction.guild?.members.fetch(userid).catch(() => null);
            if (!member) return [index, { tag: "Anonymous", pic: config.default_values.icons.no_picture }, points];

            return [index, { tag: DiscordUtils.getUserName(member.user, true), pic: member.displayAvatarURL({
                extension: "png",
            }) }, Math.floor(points), member.premiumSinceTimestamp];
        }));

        const buffer = await generateImage(top10WithNames);

        const topImage = new AttachmentBuilder(buffer)
            .setName("top.png");

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(await __("replies.top_users.title", interaction.guild?.name)(interaction.guildId))
            .setDescription(await __("replies.top_users.description")(interaction.guildId))
            .setImage("attachment://top.png");

        const messageOptions = {
            files: [topImage],
            embeds: [embed],
        };

        return await interaction.followUp(messageOptions);
    },
};
