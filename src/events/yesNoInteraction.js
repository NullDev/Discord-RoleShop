import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Create a yes/no interaction
 *
 * @param {import("discord.js").CommandInteraction} interaction
 * @param {object} options
 * @returns {Promise<[string, import("discord.js").MessageComponentInteraction | null]>}
 */
const createYesNoInteraction = async function(interaction, {
    promptText = "Are you sure?",
    yesText = "Yes",
    noText = "No",
    yesStyle = ButtonStyle.Success,
    noStyle = ButtonStyle.Danger,
    showNoFirst = false,
}){
    const yes = new ButtonBuilder()
        .setCustomId("yes")
        .setLabel(yesText)
        .setStyle(yesStyle);

    const no = new ButtonBuilder()
        .setCustomId("no")
        .setLabel(noText)
        .setStyle(noStyle);

    const row = showNoFirst
        ? new ActionRowBuilder().addComponents(no, yes)
        : new ActionRowBuilder().addComponents(yes, no);

    const response = await interaction.reply({
        content: promptText,
        // @ts-ignore
        components: [row],
    });

    const collectorFilter = i => i.user.id === interaction.user.id;
    try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
        return [confirmation.customId, confirmation];
    }
    catch (e){
        await response.edit({ components: [] });
        return ["timeout", null];
    }
};

export default createYesNoInteraction;
