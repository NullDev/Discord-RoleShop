import path from "node:path";
import { ComponentType, SlashCommandBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import translations from "../../../locales/commands/translations.js";
import __ from "../../service/i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const roleDb = new QuickDB({
    filePath: path.resolve("./data/roles.sqlite"),
});

/**
 * Generate the role menu
 *
 * @param {Array} rolesToReturn
 * @param {import("discord.js").CommandInteraction} interaction
 * @return {Promise<Object>}
 */
const generateRoleMenu = async function(rolesToReturn, interaction){
    const options = rolesToReturn.map(async([role, roleid, price]) => ({
        label: role,
        value: JSON.stringify({ role, roleid, price }),
        description: await __("replies.return.return_role", price)(interaction.guildId),
    }));

    const selectMenu = {
        customId: "role_return",
        placeholder: await __("replies.return.select_role")(interaction.guildId),
        options: await Promise.all(options),
    };

    return selectMenu;
};

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-return`)
        .setDescription(translations.return.desc)
        .setDescriptionLocalizations(translations.return.translations)
        .setDMPermission(false),

    /**
     * @param {import("discord.js").CommandInteraction} interaction
     */
    async execute(interaction){
        await interaction.deferReply();

        const roles = await roleDb.get(`guild-${interaction.guildId}`);
        if (!roles || Object.keys(roles).length === 0){
            return await interaction.followUp({
                content: await __("errors.no_roles")(interaction.guildId),
                ephemeral: true,
            });
        }

        const userRoles = /** @type {import("discord.js").GuildMemberRoleManager} */ (interaction.member?.roles).cache;
        const commonRoles = Object.keys(roles).filter(roleid => userRoles.has(roleid));

        if (commonRoles.length === 0){
            return await interaction.followUp({
                content: await __("replies.return.none_owned")(interaction.guildId),
                ephemeral: true,
            });
        }

        const rolesToReturn = commonRoles.map(roleid => {
            const roleObj = interaction.guild?.roles.cache.get(roleid);
            const role = roleObj?.name;
            const price = roles[roleid];
            return [role, roleid, price];
        });

        const selectMenu = await generateRoleMenu(rolesToReturn, interaction);

        return await interaction.followUp({
            content: await __("replies.return.which_role")(interaction.guildId),
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
