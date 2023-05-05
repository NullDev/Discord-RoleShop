import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "../../../config/config.js";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/roles.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-remove-role`)
        .setDescription("Removed a role from the Shop.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName("name")
                .setDescription("Name of the role")
                .setRequired(true),
        ).addBooleanOption((option) =>
            option.setName("delete")
                .setDescription("Delete the role from the Discord server")
                .setRequired(true),
        ),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const name = String(interaction.options.get("name")?.value);
        if (!name) return await interaction.reply({ content: "Invalid name", ephemeral: true });

        const del = Boolean(interaction.options.get("delete")?.value || false);

        const role = interaction.guild?.roles.cache.find((r) => r.name === name);
        if (!role) return await interaction.reply({ content: "Role not found", ephemeral: true });

        await db.delete(`guild-${interaction.guildId}.${role?.id}`);

        if (del){
            await role.delete().catch(() => {
                return interaction.reply({ content: "Failed to delete role", ephemeral: true });
            });
        }

        return await interaction.reply({ content: "Role removed", ephemeral: true });
    },
};
