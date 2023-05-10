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
        .setName(`${config.bot_settings.slash_command_prefix}-shop`)
        .setDescription("Shop for new roles.")
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

        const promises = Object.entries(roles).map(async([roleid, price]) => {
            const roleObj = await interaction.guild?.roles.fetch(roleid);
            const role = roleObj?.name;

            if (!role){
                await roleDb.delete(`guild-${interaction.guildId}.${roleid}`);
                return null;
            }

            const roleColor = roleObj?.color.toString(16);
            const userOwnsRole = /** @type {import("discord.js").GuildMemberRoleManager} */ (interaction.member?.roles)?.cache.has(roleid);
            return [role, roleid, price, userOwnsRole, roleColor];
        });

        const roleArray = (await Promise.all(promises)).filter(x => x !== null);
        if (roleArray.length === 0){
            return await interaction.reply({
                content: await __("errors.no_roles")(interaction.guildId),
                ephemeral: true,
            });
        }

        // @ts-ignore
        const fields = roleArray.map(async([role, , price, userOwnsRole, roleColor]) => {
            const color = roleColor ? `[#${roleColor}](https://www.color-hex.com/color/${roleColor})` : "None";
            return {
                name: role,
                value: `Price: ${price} points.\nOwned: ${userOwnsRole ? "✅" : "❌"}\nColor: ${color}`,
                inline: false,
            };
        });

        const guildServerImg = interaction.guild?.iconURL({ extension: "png" }) ?? "https://cdn.discordapp.com/embed/avatars/0.png";
        const embed = {
            title: `${interaction.guild?.name}'s Role Shop`,
            description: "Buy roles with your points here",
            color: 2518621,
            thumbnail: {
                url: guildServerImg,
            },
            fields: await Promise.all(fields),
        };

        const selectMenu = {
            customId: "role_buy",
            placeholder: "Select a role to buy",
            options: roleArray
                .filter(([, , , userOwnsRole]) => !userOwnsRole)
                .map(([role, roleid, price]) => ({
                    label: role,
                    value: roleid,
                    description: `Price: ${price} points`,
                })),
        };

        return await interaction.followUp({
            embeds: [embed],
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
