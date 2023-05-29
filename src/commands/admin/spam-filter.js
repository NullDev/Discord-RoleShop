import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "../../../config/config.js";
import { QuickDB } from "quick.db";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/guild_settings.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-spam-filter`)
        .setDescription("Enables or disables the spam filter server wide.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption((option) =>
            option.setName("enabled")
                .setDescription("Enable or disable the spam filter")
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const isEnabled = Boolean(interaction.options.get("enabled")?.value);
        await db.set(`guild-${interaction.guildId}.spam-filter`, isEnabled);

        const state = await __(`generic.set.${String(isEnabled).toLowerCase()}`)(interaction.guildId);
        return await interaction.reply({
            content: await __("replies.spam_filter.set", state)(interaction.guildId),
            ephemeral: true,
        });
    },
};
