import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
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
        await interaction.reply({
            content: await __("replies.reset_all.are_you_sure")(interaction.guildId),
        });
        const filter = (m) => m.author.id === interaction.user.id;
        const collector = interaction.channel?.createMessageCollector({ filter, time: 15000 });

        collector?.on("collect", async(m) => {
            if (m.content.toLowerCase() === "y"){
                const data = await db.get(`guild-${interaction.guildId}`);
                if (data) await db.delete(`guild-${interaction.guildId}`);

                await m.reply({
                    content: await __("replies.reset_all.sucess")(interaction.guildId),
                });
            }
            else if (m.content.toLowerCase() === "n"){
                await m.reply({
                    content: await __("replies.reset_all.abort")(interaction.guildId),
                });
            }
            else {
                await m.reply({
                    content: await __("replies.reset_all.invalid_input")(interaction.guildId),
                });
            }
            collector.stop();
        });

        collector?.on("end", async(collected) => {
            if (collected.size === 0){
                await interaction.channel?.send({
                    content: await __("replies.reset_all.timeout")(interaction.guildId),
                });
            }
        });
    },
};
