import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, ButtonStyle } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import __ from "../../service/i18n.js";
import createYesNoInteraction from "../../events/yesNoInteraction.js";
import logTransaction from "../../service/transactionLog.js";

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
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        createYesNoInteraction(interaction, {
            promptText: await __("replies.reset_all.are_you_sure")(interaction.guildId),
            yesText: await __("replies.reset_all.confirm")(interaction.guildId),
            noText: await __("generic.abort")(interaction.guildId),
            noStyle: ButtonStyle.Secondary,
            yesStyle: ButtonStyle.Danger,
            showNoFirst: true,
        }).then(async(answer) => {
            if (answer === "yes"){
                const data = await db.get(`guild-${interaction.guildId}`);
                if (data) await db.delete(`guild-${interaction.guildId}`);

                await logTransaction(interaction.guildId, interaction.user.id, "RESET-GUILD");

                await interaction.followUp({ content: await __("replies.reset_all.sucess")(interaction.guildId) });
            }
            else if (answer === "no"){
                await interaction.followUp({ content: await __("generic.aborted")(interaction.guildId) });
            }
        });
    },
};
