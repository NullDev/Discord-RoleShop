import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { config } from "../../../config/config.js";
import { QuickDB } from "quick.db";
import createYesNoInteraction from "../../events/yesNoInteraction.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/roles.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-add-role`)
        .setDescription("Adds a new role to the shop (either an existing one on the server or creates a new one).")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName("name")
                .setDescription("Name of the role")
                .setRequired(true),
        ).addIntegerOption((option) =>
            option.setName("price")
                .setDescription("Price of the role")
                .setRequired(true),
        ),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const name = String(interaction.options.get("name")?.value);
        if (!name) return await interaction.reply({ content: "Invalid name", ephemeral: true });

        const price = Number(interaction.options.get("price")?.value);
        if (isNaN(price) || price <= 0) return await interaction.reply({ content: "Invalid price", ephemeral: true });

        let role = interaction.guild?.roles.cache.find((r) => r.name === name);
        if (!role){
            const [answer, confirmation] = await createYesNoInteraction(interaction, {
                promptText: "This role does not exist on this server. Do you want to create it?",
                yesText: "Yes",
                noText: "No",
            });

            if (answer === "yes"){
                // @ts-ignore
                role = await interaction.guild?.roles.create({
                    name,
                    color: "Random",
                }).catch(() => {
                    interaction.followUp({
                        content: "Failed to create role. Are the bot's permissions correct?",
                    });
                });
            }
            else if (answer === "no") return await confirmation?.update({ content: "Aborted", components: [] });
        }

        await db.set(`guild-${interaction.guildId}.${role?.id}`, price);

        return await interaction.reply({ content: "Role added", ephemeral: true });
    },
};
