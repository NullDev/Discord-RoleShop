import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "../../../config/config.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-admin-help`)
        .setDescription("Shows an overview of all admin commands.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const userCommands = /** @type {import("../../service/client.js").default} */ (interaction.client)
            .commands.filter(cmd => cmd.data.default_member_permissions !== undefined);

        return await interaction.reply({
            content: userCommands.map((cmd) => `**/${cmd.data.name}** - ${cmd.data.description}`).join("\n"),
            ephemeral: true,
        });
    },
};
