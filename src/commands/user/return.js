import path from "node:path";
import { ComponentType, SlashCommandBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const roleDb = new QuickDB({
    filePath: path.resolve("./data/roles.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-return`)
        .setDescription("Return a Role")
        .setDMPermission(false),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const roles = await roleDb.get(`guild-${interaction.guildId}`);
        if (!roles || Object.keys(roles).length === 0){
            return await interaction.reply({
                content: await __("errors.no_roles")(interaction.guildId),
                ephemeral: true,
            });
        }

        const userRoles = /** @type {import("discord.js").GuildMemberRoleManager} */ (interaction.member?.roles).cache;
        const commonRoles = Object.keys(roles).filter(roleid => userRoles.has(roleid));

        if (commonRoles.length === 0){
            return await interaction.reply({
                content: await __("errors.no_roles")(interaction.guildId),
                ephemeral: true,
            });
        }

        const rolesToReturn = commonRoles.map(roleid => {
            const roleObj = interaction.guild?.roles.cache.get(roleid);
            const role = roleObj?.name;
            const price = roles[roleid];
            return [role, roleid, price];
        });

        const selectMenu = {
            customId: "role_return",
            placeholder: "Select a role to return",
            options: rolesToReturn.map(([role, roleid, price]) => ({
                label: role,
                value: JSON.stringify({ role, roleid, price }),
                description: `Return this role. The original price was ${price} points.`,
            })),
        };

        return await interaction.followUp({
            content: "Which role would you like to return?",
            components: [{
                type: ComponentType.ActionRow,
                components: [{
                    type: ComponentType.StringSelect,
                    ...selectMenu,
                }],
            }],
        });
    },
};
