import { SlashCommandBuilder } from "discord.js";
import { config } from "../../../config/config.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-ping`)
        .setDescription("Replies with Pong!"),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.reply({ content: "Pong! :)", ephemeral: true });
    },
};
