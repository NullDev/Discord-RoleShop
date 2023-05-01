import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Handle interactionCreate event
 *
 * @param {import("discord.js").Interaction} interaction
 * @return {Promise<void>}
 */
const interactionCreateHandler = async function(interaction){
    if (!interaction.isChatInputCommand()) return;

    const command = /** @type {import("../service/client.js").default} */ (interaction.client)
        .commands.get(interaction.commandName);

    if (!command){
        Log.warn(`No command matching ${interaction.commandName} was found.`);
        await interaction.reply({ content: "I don't seem to know the command '" + interaction.commandName + "' :/", ephemeral: true });
        return;
    }

    try {
        await command.execute(interaction);
    }
    catch (error){
        console.error(error);
        if (interaction.replied || interaction.deferred){
            await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
        }
        else {
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
};

export default interactionCreateHandler;
