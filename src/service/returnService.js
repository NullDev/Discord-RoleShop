import {ComponentType} from "discord.js";
import createYesNoInteraction from "../events/yesNoInteraction.js";
import logTransaction from "./transactionLog.js";
import Log from "../util/log.js";
import __ from "./i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Handle Return event
 *
 * @param {import("discord.js").StringSelectMenuInteraction} interaction
 * @return {Promise<void>}
 */
const returnEventHandler = async function(interaction){
    const { role, roleid, price } = JSON.parse(interaction.values[0]);

    createYesNoInteraction(interaction, {
        promptText: await __("replies.return.are_you_sure", role, price)(interaction.guildId),
    }).then(async(answer) => {
        if (answer === "yes"){
            const rObj = /** @type {import("discord.js").GuildMemberRoleManager} */ (interaction.member?.roles);

            try {
                await rObj.remove(roleid);
            }
            catch (e){
                Log.error("Failed to remove role from user: ", e);
                return await interaction.channel?.send({
                    content: await __("replies.return.return_failed")(interaction.guildId),
                });
            }

            await logTransaction(interaction.guildId, interaction.user.id, "RETURN", roleid, role);
            Log.info(`User ${interaction.user.tag} (${interaction.user.id}) returned role ${roleid} in guild ${interaction.guildId}`);

            const newReturnableRoles = interaction.component?.options.filter(option => option.value !== interaction.values[0]);
            const selectMenu = {
                customId: "role_return",
                placeholder: await __("replies.return.select_role")(interaction.guildId),
                options: newReturnableRoles ?? [],
            };

            await interaction.message.edit({
                content: newReturnableRoles.length === 0
                    ? await __("replies.return.none_owned")(interaction.guildId)
                    : interaction.message.content,
                components: newReturnableRoles.length === 0 ? [] : [{
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.StringSelect,
                        ...selectMenu,
                    }],
                }],
            });

            return await interaction.channel?.send({
                content: await __("replies.return.return_success", role)(interaction.guildId),
            });
        }
        else if (answer === "no"){
            return await interaction.channel?.send({
                content: await __("generic.aborted")(interaction.guildId),
            });
        }

        return null;
    });
};

export default returnEventHandler;
