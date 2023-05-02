import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits, ButtonStyle } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import __ from "../../service/i18n.js";
import createYesNoInteraction from "../../events/yesNoInteraction.js";

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
        createYesNoInteraction(interaction, {
            promtText: await __("replies.reset_all.are_you_sure")(interaction.guildId),
            yesText: await __("replies.reset_all.confirm")(interaction.guildId),
            noText: await __("replies.reset_all.cancel")(interaction.guildId),
            noStyle: ButtonStyle.Secondary,
            yesStyle: ButtonStyle.Danger,
            showNoFirst: true,
        }).then(async([answer, confirmation]) => {
            if (answer === "yes"){
                const data = await db.get(`guild-${interaction.guildId}`);
                if (data) await db.delete(`guild-${interaction.guildId}`);
                await confirmation?.update({ content: await __("replies.reset_all.sucess")(interaction.guildId), components: [] });
            }
            else if (answer === "no"){
                await confirmation?.update({ content: await __("replies.reset_all.abort")(interaction.guildId), components: [] });
            }
        });
    },
};
