import createYesNoInteraction from "../events/yesNoInteraction.js";
import logTransaction from "./transactionLog.js";
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
        promptText: `so u wanna return ${role}? You will NOT get the ${price} points back?`,
    }).then(async(answer) => {
        if (answer === "yes"){
            const rObj = /** @type {import("discord.js").GuildMemberRoleManager} */ (interaction.member?.roles);

            try {
                await rObj.remove(roleid);
            }
            catch (e){
                return await interaction.channel?.send({ content: "went wrong." });
            }

            await logTransaction(interaction.guildId, interaction.user.id, roleid, role, "RETURN");
            return await interaction.channel?.send({ content: "u returned thingy" });
        }
        else if (answer === "no"){
            return await interaction.channel?.send({ content: await __("generic.aborted")(interaction.guildId) });
        }

        return null;
    });
};

export default returnEventHandler;
