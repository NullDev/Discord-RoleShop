import path from "node:path";
import { QuickDB } from "quick.db";
import Log from "../util/log.js";
import __ from "./i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const db = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
});

/**
 * Claim a random gift
 *
 * @param {import("discord.js").ButtonInteraction} interaction
 * @return {Promise<void>}
 */
const claimRandomGift = async function(interaction){
    if (interaction.replied) return;

    await interaction.update({ components: [] });

    const { user } = interaction;
    const coins = Math.floor(Math.random() * 70) + 10;

    await db.add(`guild-${interaction.guild?.id}.user-${user.id}.points`, coins);

    const embed = interaction.message.embeds[0];
    const newEmbed = {
        ...embed.data,
        description: await __("replies.gifts.user_claimed_gift", user, coins)(interaction.guildId),
        footer: {
            text: await __("replies.gifts.user_claimed_gift_footer", user.username, coins)(interaction.guildId),
        },
        timestamp: "",
    };

    Log.info(`User ${user.tag} claimed a random gift and got ${coins} coins`);
    await interaction.editReply({ embeds: [newEmbed], attachments: [] });
};

export default claimRandomGift;
