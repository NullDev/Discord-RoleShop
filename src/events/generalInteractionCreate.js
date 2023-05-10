import Log from "../util/log.js";
import buyEventHandler from "../service/buyService.js";
import returnEventHandler from "../service/returnService.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Handle general Interaction events
 *
 * @param {import("discord.js").Interaction} interaction
 * @return {Promise<void>}
 */
const generalInteractionCreateHandler = async function(interaction){
    if (interaction.isStringSelectMenu()){
        if (interaction.customId === "role_buy") await buyEventHandler(interaction);
        else if (interaction.customId === "role_return") await returnEventHandler(interaction);

        else Log.warn(`No select menu matching ${interaction.customId} was found.`);
    }
};

export default generalInteractionCreateHandler;
