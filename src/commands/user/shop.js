import path from "node:path";
import { ComponentType, SlashCommandBuilder } from "discord.js";
import { QuickDB } from "quick.db";
import { config } from "../../../config/config.js";
import Log from "../../util/log.js";
import translations from "../../../locales/commands/translations.js";
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

const userDb = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
});

export default {
    data: new SlashCommandBuilder()
        .setName(`${config.bot_settings.slash_command_prefix}-shop`)
        .setDescription(translations.shop.desc)
        .setDescriptionLocalizations(translations.shop.translations)
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

        const promises = Object.entries(roles).map(async([roleid, price]) => {
            const roleObj = await interaction.guild?.roles.fetch(roleid).catch(() => null);
            const role = roleObj?.name;

            if (!role){
                await roleDb.delete(`guild-${interaction.guildId}.${roleid}`);
                return null;
            }

            const roleColor = String(roleObj?.hexColor ?? "#000000");

            const userOwnsRole = /** @type {import("discord.js").GuildMemberRoleManager} */ (interaction.member?.roles)?.cache.has(roleid);
            return [role, roleid, price, userOwnsRole, roleColor];
        });

        const roleArray = (await Promise.all(promises)).filter(x => x !== null);
        if (roleArray.length === 0){
            return await interaction.followUp({
                content: await __("errors.no_roles")(interaction.guildId),
                ephemeral: true,
            });
        }

        // @ts-ignore
        const fields = roleArray.sort((a, b) => b?.[2] - a?.[2]).map(async([role, roleid, price, userOwnsRole, roleColor]) => {
            const color = roleColor !== "#000000" ? `[${roleColor}](https://v1.cx/color/${roleColor})` : null;
            const roleIconId = await roleEmoteDb.get(`guild-${interaction.guildId}.${roleid}`);
            let roleIcon = null;
            if (roleIconId){
                const emojiGuildId = config.bot_settings.emote_server_id;
                const emojiGuild = await interaction.client.guilds.fetch(emojiGuildId);
                const ico = await emojiGuild?.emojis?.fetch(roleIconId).catch(() => null);

                if (!ico){
                    Log.warn(`Role emoji ${roleIconId} not found on Emoji Server. Removing from database...`);
                    await roleEmoteDb.delete(`guild-${interaction.guildId}.${roleid}`);
                    roleIcon = null;
                }
                else roleIcon = ico;
            }

            const pointsStr = await __("replies.points", price, price)(interaction.guildId, true);
            const priceStr = await __("generic.price")(interaction.guildId);
            const boughtStr = await __("generic.bought")(interaction.guildId);
            const colorStr = await __("generic.color")(interaction.guildId);

            let value = `${priceStr}: ${pointsStr}. \n${boughtStr}: ${userOwnsRole ? "✅" : "❌"}`;
            if (!!color) value += `\n${colorStr}: ${color}`;

            return {
                name: !!roleIcon ? `${role} ${roleIcon.toString()}` : role,
                value,
                inline: false,
            };
        });

        const guildServerImg = interaction.guild?.iconURL({ extension: "png" }) ?? "https://cdn.discordapp.com/embed/avatars/0.png";
        const userPoints = Math.floor(await userDb.get(`guild-${interaction.guildId}.user-${interaction.user.id}.points`) ?? 0);
        const embed = {
            title: `${interaction.guild?.name}'s ${await __("generic.role_shop")(interaction.guildId)}`,
            description: String(await __("replies.shop.description")(interaction.guildId))
                + "\n" + await __(
                "replies.stats_you",
                await __("replies.points", userPoints, userPoints)(interaction.guildId, true),
            )(interaction.guildId),
            color: 2518621,
            thumbnail: {
                url: guildServerImg,
            },
            fields: await Promise.all(fields),
        };

        const selectMenuOptions = roleArray
            .filter(([, , , userOwnsRole]) => !userOwnsRole)
            .map(async([role, roleid, price]) => ({
                label: role,
                value: JSON.stringify({ role, roleid, price }),
                description: String(await __("replies.shop.price", price)(interaction.guildId)),
            }));

        const userAlreadyOwnsAllRoles = roleArray.every(([, , , userOwnsRole]) => userOwnsRole);

        const selectMenu = {
            customId: "role_buy",
            placeholder: "Select a role to buy",
            options: await Promise.all(selectMenuOptions),
        };

        await interaction.followUp("Shop:");

        return await interaction.followUp({
            embeds: [embed],
            components: userAlreadyOwnsAllRoles ? [] : [{
                type: ComponentType.ActionRow,
                components: [{
                    type: ComponentType.StringSelect,
                    ...selectMenu,
                }],
            }],
        });
    },
};
