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
        .setName(`${config.bot_settings.slash_command_prefix}-set-boost-mulitplier`)
        .setDescription(translations.set_boost_multiplier.desc)
        .setDescriptionLocalizations(translations.set_boost_multiplier.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addNumberOption((option) =>
            option.setName("value")
                .setDescription(translations.set_boost_multiplier.options.value.desc)
                .setDescriptionLocalizations(translations.set_boost_multiplier.options.value.translations)
                .setMinValue(1)
                .setRequired(true)),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const value = Number(interaction.options.get("value")?.value);
        if (isNaN(value)){
            return await interaction.reply({
                content: await __("errors.multiplier_nan")(interaction.guildId), ephemeral: true,
            });
        }

        if (value < 1){
            return await interaction.reply({
                content: await __("errors.multiplier_too_small")(interaction.guildId), ephemeral: true,
            });
        }

        await db.set(`guild-${interaction.guildId}.boost-multiplier`, value || config.default_values.poitns.multiplier);

        return await interaction.reply({
            content: value === 1
                ? await __("replies.multiplier_set_none")(interaction.guildId)
                : await __("replies.multiplier_set", value)(interaction.guildId),
            ephemeral: true,
        });
    },
};
