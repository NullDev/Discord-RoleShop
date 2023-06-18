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

    /**
     * Get top users from DB object
     *
     * @static
     * @param {Object} users
     * @param {number} [limit=0]
     * @return {Array}
     * @memberof DiscordUtils
     */
    static getTopUsers(users, limit = 0){
        const tmp = Object.entries(users)
            .filter((user) => user[1].points > 0)
            .sort((a, b) => b[1].points - a[1].points)
            .map((user, index) => ([index + 1, user[0].split("-")[1], user[1].points]));
        return (!!limit && limit > 0) ? tmp.slice(0, limit) : tmp;
    }
}

export default DiscordUtils;
