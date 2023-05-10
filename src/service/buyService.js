import createYesNoInteraction from "../events/yesNoInteraction.js";
import __ from "./i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Handle Buy event
 *
 * @param {import("discord.js").StringSelectMenuInteraction} interaction
 * @return {Promise<void>}
 */
const buyEventHandler = async function(interaction){
    const selectedRole = JSON.parse(interaction.values[0]);

    createYesNoInteraction(interaction, {
        promptText: `so u wanna buy ${selectedRole.role} for ${selectedRole.price} points?`,
    }).then(async(answer) => {
        if (answer === "yes"){
            await interaction.channel?.send({ content: "u bought thingy" });
        }
        else if (answer === "no"){
            await interaction.channel?.send({ content: await __("generic.aborted")(interaction.guildId) });
        }
    });
};

export default buyEventHandler;
