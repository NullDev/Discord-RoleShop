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
        .setName(`${config.bot_settings.slash_command_prefix}-random-gift`)
        .setDescription("Enables or disables random gifts.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption((option) =>
            option.setName("enabled")
                .setDescription("Enable or disable random gifts")
                .setRequired(true))
        .addIntegerOption((option) =>
            option.setName("cooldown")
                .setDescription("Cooldown between gifts in hours (default: 4h)")
                .setRequired(true))
        .addIntegerOption((option) =>
            option.setName("chance")
                .setDescription("Chance of a gift being sent in percent (default: 5%)")
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const isEnabled = Boolean(interaction.options.get("enabled")?.value ?? true);
        const cooldown = Number(interaction.options.get("cooldown")?.value) ?? 4;
        const chance = Number(interaction.options.get("chance")?.value) ?? 5;

        await db.set(`guild-${interaction.guildId}.gift.enabled`, isEnabled);
        await db.set(`guild-${interaction.guildId}.gift.cooldown`, cooldown);
        await db.set(`guild-${interaction.guildId}.gift.chance`, chance);

        const state = await __(`generic.set.${String(isEnabled).toLowerCase()}`)(interaction.guildId);
        return await interaction.reply({
            content: await __("replies.gift_set", state, cooldown, chance)(interaction.guildId),
            ephemeral: true,
        });
    },
};
