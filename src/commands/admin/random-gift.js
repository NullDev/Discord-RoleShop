import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "../../../config/config.js";
import { QuickDB } from "quick.db";
import translations from "../../../locales/commands/translations.js";
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
        .setDescription(translations.random_gift.desc)
        .setDescriptionLocalizations(translations.random_gift.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addBooleanOption((option) =>
            option.setName("enabled")
                .setDescription(translations.random_gift.options.enabled.desc)
                .setDescriptionLocalizations(translations.random_gift.options.enabled.translations)
                .setRequired(true))
        .addIntegerOption((option) =>
            option.setName("cooldown")
                .setDescription(translations.random_gift.options.cooldown.desc)
                .setDescriptionLocalizations(translations.random_gift.options.cooldown.translations)
                .setRequired(true))
        .addIntegerOption((option) =>
            option.setName("chance")
                .setDescription(translations.random_gift.options.chance.desc)
                .setDescriptionLocalizations(translations.random_gift.options.chance.translations)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const isEnabled = Boolean(interaction.options.get("enabled")?.value ?? true);
        const cooldown = Number(interaction.options.get("cooldown")?.value) ?? config.default_values.random_gift.cooldown;
        const chance = Number(interaction.options.get("chance")?.value) ?? config.default_values.random_gift.chance;

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
