import path from "node:path";
import { QuickDB } from "quick.db";
import createYesNoInteraction from "../events/yesNoInteraction.js";
import logTransaction from "./transactionLog.js";
import __ from "./i18n.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const userDb = new QuickDB({
    filePath: path.resolve("./data/users.sqlite"),
});

/**
 * Handle Buy event
 *
 * @param {import("discord.js").StringSelectMenuInteraction} interaction
 * @return {Promise<void>}
 */
const buyEventHandler = async function(interaction){
    const { role, roleid, price } = JSON.parse(interaction.values[0]);

    createYesNoInteraction(interaction, {
        promptText: `so u wanna buy ${role} for ${price} points?`,
    }).then(async(answer) => {
        if (answer === "yes"){
            const rObj = /** @type {import("discord.js").GuildMemberRoleManager} */ (interaction.member?.roles);
            const hasRole = rObj.cache.find((r) => r.id === roleid);
            if (hasRole){
                return await interaction.channel?.send({ content: await __("replies.shop.already_owned")(interaction.guildId) });
            }

            const userData = await userDb.get(`guild-${interaction.guildId}.user-${interaction.user.id}`);
            if (!userData || userData.points < price){
                return await interaction.channel?.send({ content: "u poor" });
            }

            try {
                const user = await rObj.add(roleid);
                if (!user.roles.cache.find((r) => r.id === roleid)){
                    throw new Error("Role has not been added");
                }
            }
            catch (e){
                return await interaction.channel?.send({ content: "went wrong. no points removed" });
            }

            const newBalance = await userDb.sub(`guild-${interaction.guildId}.user-${interaction.user.id}.points`, price);
            await logTransaction(interaction.guildId, interaction.user.id, roleid, role, "BUY", price);
            return await interaction.channel?.send({ content: "u bought thingy for " + price + " points. u now have " + newBalance + " points" });
        }
        else if (answer === "no"){
            return await interaction.channel?.send({ content: await __("generic.aborted")(interaction.guildId) });
        }

        return null;
    });
};

export default buyEventHandler;
