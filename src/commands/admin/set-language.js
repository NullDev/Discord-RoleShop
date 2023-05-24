import path from "node:path";
import fs from "node:fs";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "../../../config/config.js";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_settings.sqlite"),
});

const getLanguages = function(){
    const languages = fs.readdirSync(path.resolve("./locales"));

    return languages.map((lang) => ({
        name: lang.split("_")[0],
        value: lang.split(".")[0],
    }));
};

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-set-language`)
        .setDescription("Sets the server language for the bot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option.setName("language")
                .setDescription("Server language")
                .setRequired(true)
                .addChoices(...getLanguages())),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const lang = interaction.options.get("language");
        if (!lang) return await interaction.reply({ content: "Invalid language", ephemeral: true });
        await db.set(`guild-${interaction.guildId}.locale`, lang.value || "English_en");
        return await interaction.reply({ content: "Language set to: " + lang.value, ephemeral: true });
    },
};
