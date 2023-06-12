// @WARN: TEMPORARY UTILITY CLASS
// UNTIL POMELO SUPPORT LANDED IN DISCORD.JS
// SEE: https://github.com/discordjs/discord.js/commit/1ab60f9da4d6b7ea144fa05b97b029a4bfaeede2

class DiscordUtils {
    /**
     * Get the name of a user
     *
     * @static
     * @param {import("discord.js").User} user
     * @param {boolean} [discriminator=false]
     * @memberof DiscordUtils
     */
    static getUserName(user, discriminator = false){
        return `${user.username}${(user.discriminator !== "0" && discriminator) ? `#${user.discriminator}` : ""}`;
    }
}

export default DiscordUtils;
