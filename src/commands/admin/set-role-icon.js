import path from "node:path";
import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const roleDb = new QuickDB({
    filePath: path.resolve("./data/roles.sqlite"),
});

const roleEmoteDb = new QuickDB({
    filePath: path.resolve("./data/role_emotes.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-set-role-icon`)
        .setDescription("Sets the icon of a role.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption((option) => option
            .setName("role")
            .setDescription("The role to set the icon for.")
            .setRequired(true),
        )
        .addAttachmentOption((option) => option
            .setName("icon")
            .setDescription("The icon to set.")
            .setRequired(true),
        ),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        interaction.deferReply({ ephemeral: true});

        const roleId = interaction.options.get("role", true).role?.id;
        if (!roleId){
            return await interaction.followUp({
                content: await __("errors.invalid_role")(interaction.guildId),
                ephemeral: true,
            });
        }

        const roles = await roleDb.get(`guild-${interaction.guildId}`);
        if (!roles || Object.keys(roles).length === 0 || !Object.keys(roles).includes(roleId)){
            return await interaction.followUp({
                content: await __("errors.not_in_shop")(interaction.guildId),
                ephemeral: true,
            });
        }

        const {attachment} = interaction.options.get("icon", true);

        const validTypes = ["jpg", "jpeg", "png", "gif"];
        const type = attachment?.name?.split(".").pop()?.toLowerCase() ?? "x";

        if (!attachment || !attachment.contentType?.startsWith("image/") || (!type || !validTypes.includes(type))){
            return await interaction.followUp({
                content: await __("errors.unsupported_format")(interaction.guildId),
                ephemeral: true,
            });
        }

        const emoteServerId = config.bot_settings.emote_server_id;
        if (!emoteServerId){
            return await interaction.followUp({
                content: await __("errors.no_emote_server")(interaction.guildId),
                ephemeral: true,
            });
        }

        const emoteServer = await interaction.client.guilds.fetch(emoteServerId).catch(() => null);
        if (!emoteServer){
            return await interaction.followUp({
                content: await __("errors.emote_server_not_found")(interaction.guildId),
                ephemeral: true,
            });
        }

        const emoteExists = await emoteServer.emojis.cache.find((emote) => emote.name === roleId);
        if (emoteExists) await emoteExists.delete().catch(() => null);

        const emote = await emoteServer.emojis.create({
            name: roleId,
            attachment: attachment.url,
        }).catch(() => null);

        if (!emote || !emote.id){
            return await interaction.followUp({
                content: await __("errors.failed_to_upload_emote")(interaction.guildId),
                ephemeral: true,
            });
        }

        await roleEmoteDb.set(`guild-${interaction.guildId}.${roleId}`, emote.id);

        return await interaction.followUp({
            content: await __("replies.role_icon_set")(interaction.guildId),
            ephemeral: true,
        });
    },
};
