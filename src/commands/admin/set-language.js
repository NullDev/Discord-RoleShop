import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
// import { config } from "../../../config/config.js";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB();

export default {
    data: new SlashCommandBuilder()
        .setName("rs-set-language")
        .setDescription("Sets the Server Language for the bot.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName("language")
                .setDescription("Server language")
                .setRequired(true)
                .addChoices(
                    { name: "German", value: "de" },
                    { name: "English", value: "en" },
                )),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const lang = interaction.options.get("language");
        if (!lang) return await interaction.reply({ content: "Invalid language", ephemeral: true });
        await db.set(`${interaction.guildId}.locale`, lang.value || "en");
        return await interaction.reply({ content: "Language set to: " + lang.value, ephemeral: true });
    },
};
