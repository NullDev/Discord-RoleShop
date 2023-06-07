import path from "node:path";
import { QuickDB } from "quick.db";
import {ComponentType} from "discord.js";
import createYesNoInteraction from "../events/yesNoInteraction.js";
import logTransaction from "./transactionLog.js";
import Log from "../util/log.js";
import __ from "./i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const userDb = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
});

/**
 * Handle Buy event
 *
 * @param {import("discord.js").StringSelectMenuInteraction} interaction
 * @return {Promise<void>}
 */
const buyEventHandler = async function(interaction){
    const { role, roleid, price } = JSON.parse(interaction.values[0]);

    createYesNoInteraction(interaction, {
        promptText: await __("replies.shop.buy_confirmation", role, price)(interaction.guildId),
    }).then(async(answer) => {
        if (answer === "yes"){
            const rObj = /** @type {import("discord.js").GuildMemberRoleManager} */ (interaction.member?.roles);
            const hasRole = rObj.cache.find((r) => r.id === roleid);
            if (hasRole){
                return await interaction.channel?.send({ content: await __("replies.shop.already_owned")(interaction.guildId) });
            }

            const userData = await userDb.get(`guild-${interaction.guildId}.user-${interaction.user.id}`);
            if (!userData || userData.points < price){
                return await interaction.channel?.send({ content: await __("errors.not_enough_points")(interaction.guildId) });
            }

            try {
                const user = await rObj.add(roleid);
                if (!user.roles.cache.find((r) => r.id === roleid)){
                    throw new Error("Role has not been added");
                }
            }
            catch (e){
                Log.error("Failed to add role to user: ", e);
                return await interaction.channel?.send({ content: await __("errors.buy_fail")(interaction.guildId) });
            }

            const oldBalance = userData.points;
            const newBalance = await userDb.sub(`guild-${interaction.guildId}.user-${interaction.user.id}.points`, price);
            const embed = interaction.message.embeds?.[0];

            if (!embed) return Log.error("Shop embed not found", new Error());

            const oldFields = embed.fields;

            const boughtField = oldFields.filter(field => field.name === role);
            boughtField[0].value = boughtField[0].value.replace("❌", "✅");
            oldFields[oldFields.findIndex(field => field.name === role)] = boughtField[0];

            const newEmbed = {
                ...embed.data,
                description: String(await __("replies.shop.description")(interaction.guildId))
                + "\n" + await __(
                    "replies.stats_you",
                    await __("replies.points", newBalance, newBalance)(interaction.guildId, true),
                )(interaction.guildId),
                fields: oldFields,
            };

            const newInteractionRoles = interaction.component?.options.filter(option => option.value !== interaction.values[0]);
            const selectMenu = {
                customId: "role_buy",
                placeholder: "Select a role to buy",
                options: newInteractionRoles ?? [],
            };

            await logTransaction(interaction.guildId, interaction.user.id, "BUY", roleid, role, price, oldBalance, newBalance);
            Log.done("User " + interaction.user.tag + " (" + interaction.user.id + ") bought role " + role + " for " + price + " points");

            await interaction.message.edit({
                embeds: [newEmbed],
                components: newInteractionRoles.length === 0 ? [] : [{
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.StringSelect,
                        ...selectMenu,
                    }],
                }],
            });

            return await interaction.channel?.send({ content: await __("replies.shop.success", role, price, newBalance)(interaction.guildId) });
        }
        else if (answer === "no"){
            return await interaction.channel?.send({ content: await __("generic.aborted")(interaction.guildId) });
        }

        return null;
    });
};

export default buyEventHandler;
