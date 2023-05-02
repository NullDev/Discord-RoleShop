import os from "node:os";
import { SlashCommandBuilder } from "discord.js";
import { config } from "../../../config/config.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-info`)
        .setDescription("Shows Info about this bot.")
        .setDMPermission(false),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const count = interaction.guild?.memberCount || "N/A";
        const boosts = interaction.guild?.premiumSubscriptionCount || "N/A";

        const created = interaction.guild?.createdAt.toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }) || "N/A";

        const guildOwner = interaction.guild?.ownerId;
        let owner = "N/A";
        if (guildOwner) owner = (await interaction.client.users.fetch(guildOwner)).tag;

        const embed = {
            title: "Bot Info",
            description: await __("replies.bot_info_tagline")(interaction.guildId),
            color: 2518621,
            thumbnail: {
                url: "https://cdn.discordapp.com/avatars/1102551839674740737/3354a0eebe93a021d96e53c271b0316e.webp?size=128",
            },
            fields: [
                {
                    name: "Author :computer:",
                    value: "`SHADOW#1337` / [NullDev](https://github.com/NullDev)",
                    inline: true,
                },
                {
                    name: "Source Code :scroll:",
                    value: "[NullDev/Discord-RoleShop](https://github.com/NullDev/Discord-RoleShop)",
                    inline: true,
                },
                { name: "\u200b", value: "\u200b", inline: true },
                {
                    name: "Programming Language :wrench:",
                    value: `NodeJS ${process.version}`,
                    inline: true,
                },
                {
                    name: "Server OS :pager:",
                    value: `${os.type()} ${os.release()} ${os.arch()}`,
                    inline: true,
                },
                { name: "\u200b", value: "\u200b", inline: true },
                {
                    name: "Meta :bar_chart:",
                    value: `PID: \`${process.pid}\`\nUptime: \`${process.uptime().toFixed(4)}s\`\nSystem CPU Time: \`${process.cpuUsage().system}\`\nUser CPU Time: \`${process.cpuUsage().system}\``,
                    inline: true,
                },
                {
                    name: "Guild :clipboard:",
                    value: `User: \`${count}\`\nBoosts: \`${boosts}\`\nCreated: \`${created}\`\nOwner: \`${owner}\``,
                    inline: true,
                },
                { name: "\u200b", value: "\u200b", inline: true },
            ],
        };

        return await interaction.reply({ embeds: [embed] });
    },
};
