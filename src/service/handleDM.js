import { config } from "../../config/config.js";

/**
 * Handle DM messages
 *
 * @param {import("discord.js").Message} message
 */
const handleDM = async function(message){
    if (message.author.id !== config.bot_settings.bot_owner_id) return;

    const cont = message.content;
    if (cont.startsWith(".gw")){
        const split = cont.split(" ");
        const id = split[1].trim();
        let replyto = split[2].trim();
        if (!replyto.startsWith("r:")) replyto = "";
        const msg = split.slice(2).join(" ").trim();

        if (!id || !msg) return;

        try {
            const channel = await message.client.channels.fetch(id).catch(() => null);
            if (!channel) return;

            if (replyto !== ""){
                // @ts-ignore
                const msgR = await channel.messages.fetch(replyto.slice(2)).catch(() => null);
                if (!msgR) return;
                await msgR.reply(msg.replace(replyto, "")).catch(() => null);
                return;
            }

            // @ts-ignore
            await channel.send(msg).catch(() => null);
        }
        catch (e){ /* */ }
    }
};

export default handleDM;
