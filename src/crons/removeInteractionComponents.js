import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const removeInteractionComponents = async function(client){
    Log.wait("[CRON] Started removing interaction components...");

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const tenMinutesAgo = currentTimestamp - (10 * 60);
    const twentyMinutesAgo = currentTimestamp - (20 * 60);

    const channels = client.channels.cache.filter((c) => c.isText());

    let messagesEdited = 0;

    for (const channel of channels.values()){
        const messages = await channel.messages.fetch({ limit: 100 });

        for (const message of messages.values()){
            if (message.author.id === client.user.id && message.editedAt){
                const editedTimestamp = Math.floor(message.editedAt.getTime() / 1000);

                if (editedTimestamp >= tenMinutesAgo && editedTimestamp <= twentyMinutesAgo){
                    await message.edit({ components: [] });
                    messagesEdited++;
                }
            }
        }
    }

    Log.done("[CRON] Removed " + messagesEdited + " interaction components!");

    return null;
};

export default removeInteractionComponents;
