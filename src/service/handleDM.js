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
        const msg = split.slice(2).join(" ").trim();

        if (!id || !msg) return;

        try {
            const channel = await message.client.channels.fetch(id);
            if (!channel) return;
            // @ts-ignore
            await channel.send(msg);
        }
        catch (e){ /* */ }
    }
};

export default handleDM;
