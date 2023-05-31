import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "../../../config/config.js";
import { QuickDB } from "quick.db";
import createYesNoInteraction from "../../events/yesNoInteraction.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/roles.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-add-role`)
        .setDescription(translations.add_role.desc)
        .setDescriptionLocalizations(translations.add_role.translations)
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option.setName("name")
                .setDescription(translations.add_role.options.name.desc)
                .setDescriptionLocalizations(translations.add_role.options.name.translations)
                .setRequired(true),
        ).addIntegerOption((option) =>
            option.setName("price")
                .setDescription(translations.add_role.options.price.desc)
                .setDescriptionLocalizations(translations.add_role.options.price.translations)
                .setRequired(true),
        ),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const name = String(interaction.options.get("name")?.value);
        if (!name){
            return await interaction.reply({
                content: await __("errors.invalid_name")(interaction.guildId),
                ephemeral: true,
            });
        }

        const price = Number(interaction.options.get("price")?.value);
        if (isNaN(price) || price <= 0){
            return await interaction.reply({
                content: await __("errors.invalid_price")(interaction.guildId),
                ephemeral: true,
            });
        }

        let role = interaction.guild?.roles.cache.find((r) => r.name === name);
        if (!role){
            const answer = await createYesNoInteraction(interaction, {
                promptText: await __("replies.add_role.doesn_exist_prompt", name)(interaction.guildId),
                yesText: await __("generic.yes")(interaction.guildId),
                noText: await __("generic.no")(interaction.guildId),
            });

            if (answer === "yes"){
                // @ts-ignore
                role = await interaction.guild?.roles.create({
                    name,
                    color: "Random",
                    permissions: [],
                }).catch(() => null);
            }
            else if (answer === "no"){
                return await interaction.followUp({
                    content: await __("generic.aborted")(interaction.guildId),
                    components: [],
                });
            }
            else if (answer === "timeout") return null;
        }

        if (!role){
            return interaction.reply({
                content: await __("replies.add_role.no_perms")(interaction.guildId),
            });
        }

        const currentRole = await db.get(`guild-${interaction.guildId}.${role?.id}`);
        if (currentRole && currentRole === price){
            const content = await __("replies.add_role.same_exists", name, currentRole)(interaction.guildId);

            if (interaction.replied || interaction.deferred) return interaction.followUp({ content });

            return await interaction.reply({ content });
        }

        await db.set(`guild-${interaction.guildId}.${role?.id}`, price);

        const content = currentRole
            ? await __("replies.add_role.updated", role.name, currentRole, price)(interaction.guildId)
            : await __("replies.add_role.added", role.name, price)(interaction.guildId);

        if (interaction.replied || interaction.deferred) return interaction.followUp({ content });

        return await interaction.reply({ content });
    },
};
