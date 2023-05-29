import path from "node:path";
import fs from "node:fs/promises";
import { QuickDB } from "quick.db";
import { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle  } from "discord.js";
import Log from "../util/log.js";
import __ from "./i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const guildSettingsDb = new QuickDB({
    filePath: path.resolve("./data/guild_settings.sqlite"),
});

/**
 * Send a random gift
 *
 * @param {import("discord.js").Message} message
 */
const sendRandomGift = async function(message){
    const guildId = message.guild?.id;
    if (!guildId) return;

    const isEnabled = (await guildSettingsDb.get(`guild-${guildId}.gift.enabled`)) ?? true;
    if (!isEnabled) return;

    const chance = (await guildSettingsDb.get(`guild-${guildId}.gift.chance`)) ?? 5;
    const shouldSend = (Math.random() * 100) < chance;

    if (!shouldSend) return;

    const lastSent = (await guildSettingsDb.get(`guild-${guildId}.gift.last_sent`)); // UTC timestamp
    const cooldown = (await guildSettingsDb.get(`guild-${guildId}.gift.cooldown`)) ?? 4; // hours

    const now = Date.now();
    if (!!lastSent && (now - lastSent) < cooldown * 60 * 60 * 1000) return;

    const buffer = await fs.readFile(path.resolve("./assets/gift.gif"));
    const giftImage = new AttachmentBuilder(buffer)
        .setName("gift.gif");

    const claim = new ButtonBuilder()
        .setCustomId("claim_gift")
        .setLabel(await __("replies.gifts.claim")(guildId))
        .setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder()
        .addComponents(claim);

    const embed = new EmbedBuilder()
        .setColor("#00FFFF")
        .setTimestamp(now)
        .setTitle(await __("replies.gifts.gift")(guildId))
        .setDescription(await __("replies.gifts.gift_appeard")(guildId))
        .setImage("attachment://gift.gif");

    let msg;
    try {
        msg = await message.channel.send({
            files: [giftImage],
            embeds: [embed],
            // @ts-ignore
            components: [actionRow],
        });
    }
    catch (e){
        Log.error("Failed to send gift: ", e);
        return;
    }

    await guildSettingsDb.set(`guild-${guildId}.gift.last_sent`, now);

    setTimeout(async() => {
        const updatedMsg = await message.channel.messages.fetch(msg.id);
        if (!updatedMsg) return;

        const { components } = updatedMsg;
        if (!components) return;

        const claimButton = components[0]?.components[0];
        if (!claimButton) return;

        if (claimButton.disabled) return;

        const oldEmbed = updatedMsg.embeds[0];
        const newEmbed = {
            ...oldEmbed.data,
            description: await __("replies.gifts.too_late")(guildId),
            footer: {
                text: await __("replies.gifts.too_late_footer")(guildId),
            },
            timestamp: "",
        };

        await updatedMsg.edit({ embeds: [newEmbed], attachments: [], components: [] });
    }, 2 * 60 * 1000);
};

export default sendRandomGift;
