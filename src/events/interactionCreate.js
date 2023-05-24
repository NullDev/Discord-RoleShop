import Log from "../util/log.js";
import __ from "../service/i18n.js";
import buyEventHandler from "../service/buyService.js";
import returnEventHandler from "../service/returnService.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Handle command Interaction events
 *
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @return {Promise<void>}
 */
const handleCommandInteraction = async function(interaction){
    const command = /** @type {import("../service/client.js").default} */ (interaction.client)
        .commands.get(interaction.commandName);

    if (!command){
        Log.warn(`No command matching ${interaction.commandName} was found.`);
        await interaction.reply({ content: await __("errors.command_not_found", interaction.commandName)(interaction.guildId), ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    }
    catch (error){
        Log.error("Error during command execution: ", error);
        if (interaction.replied || interaction.deferred){
            await interaction.followUp({ content: await __("errors.generic_command_execution_failed")(interaction.guildId), ephemeral: true });
        }
        else {
            await interaction.reply({ content: await __("errors.generic_command_execution_failed")(interaction.guildId), ephemeral: true });
        }
    }
};

/**
 * Handle select menu Interaction events
 *
 * @param {import("discord.js").StringSelectMenuInteraction} interaction
 * @return {Promise<any>}
 */
const handleSelectMenuInteraction = async function(interaction){
    if (interaction.user.id !== interaction.message.interaction?.user.id){
        return await interaction.reply({
            content: await __("errors.interaction_not_yours")(interaction.guildId),
            ephemeral: true,
        });
    }

    if (interaction.customId === "role_buy") return await buyEventHandler(interaction);
    else if (interaction.customId === "role_return") return await returnEventHandler(interaction);

    return Log.warn(`No select menu matching ${interaction.customId} was found.`);
};

/**
 * Handle interactionCreate event
 *
 * @param {import("discord.js").Interaction} interaction
 * @return {Promise<void>}
 */
const interactionCreateHandler = async function(interaction){
    if (interaction.isStringSelectMenu()) await handleSelectMenuInteraction(interaction);
    if (interaction.isChatInputCommand()) await handleCommandInteraction(interaction);
};

export default interactionCreateHandler;
