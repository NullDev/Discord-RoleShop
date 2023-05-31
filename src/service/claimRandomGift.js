import path from "node:path";
import { QuickDB } from "quick.db";
import Log from "../util/log.js";
import __ from "./i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const userDb = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
});

const guildSettingsDb = new QuickDB({
    filePath: path.resolve("./data/guild_settings.sqlite"),
});

/**
 * Claim a random gift
 *
 * @param {import("discord.js").ButtonInteraction} interaction
 * @return {Promise<void>}
 */
const claimRandomGift = async function(interaction){
    if (interaction.replied) return;

    const isClaimed = await guildSettingsDb.get(`guild-${interaction.guild?.id}.gift.last_gift_claimed`);
    if (isClaimed) return;

    await guildSettingsDb.set(`guild-${interaction.guild?.id}.gift.last_gift_claimed`, true);

    await interaction.update({ components: [] });

    const { user } = interaction;
    const coins = Math.floor(Math.random() * 70) + 10;

    await userDb.add(`guild-${interaction.guild?.id}.user-${user.id}.points`, coins);

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
