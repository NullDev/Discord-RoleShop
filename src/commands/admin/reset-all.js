import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-reset-all`)
        .setDescription("Resets ALL stats for this server.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        const confirm = new ButtonBuilder()
            .setCustomId("confirm")
            .setLabel(await __("replies.reset_all.confirm")(interaction.guildId))
            .setStyle(ButtonStyle.Danger);

        const cancel = new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel(await __("replies.reset_all.cancel")(interaction.guildId))
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(cancel, confirm);

        const response = await interaction.reply({
            content: await __("replies.reset_all.are_you_sure")(interaction.guildId),
            // @ts-ignore
            components: [row],
        });

        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

            if (confirmation.customId === "confirm"){
                const data = await db.get(`guild-${interaction.guildId}`);
                if (data) await db.delete(`guild-${interaction.guildId}`);

                await confirmation.update({ content: await __("replies.reset_all.sucess")(interaction.guildId), components: [] });
            }
            else if (confirmation.customId === "cancel"){
                await confirmation.update({ content: await __("replies.reset_all.abort")(interaction.guildId), components: [] });
            }
        }
        catch (e){
            await response.edit({ components: [] });
            await interaction.followUp({ content: await __("replies.reset_all.timeout")(interaction.guildId) });
        }
    },
};
