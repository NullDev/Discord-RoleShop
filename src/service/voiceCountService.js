import path from "node:path";
import { QuickDB } from "quick.db";
import Log from "../util/log.js";

class VoiceCount {
    constriuctor(){
        this.trackedUsers = [];
        this.db = new QuickDB({
            filePath: path.resolve("./data/users.sqlite"),
        });

        setInterval(() => {
            this.#voicePointsWorker();
        }, 60000);
    }

    /**
     * Worker that runs every minute
     *
     * @memberof VoiceCount
     */
    #voicePointsWorker(){
        // 0.5 points per minute
        // Boost multiplier = 2 (so that they'll get 1 point per minute)
        // Points can also be given to users which are in idle mode, but not if they are muted
        // After being in voice chat for more than 5 hours straight, users shouldn't get any more points

        this.trackedUsers.forEach(async trackedUser => {
            const guildid = /** @type {string} */ (trackedUser.guild);
            const member = /** @type {import("discord.js").GuildMember} */ (trackedUser.user);
            const state = /** @type {import("discord.js").VoiceState} */ (trackedUser.newState);

            if (state.selfMute || state.mute) return;

            const timeSpent = Date.now() - trackedUser.startTime;
            const minutesSpent = Math.floor(timeSpent / 60000);

            // 5hrs
            if (minutesSpent >= 300) return;

            const points = !!member.premiumSince ? 1 : 0.5;

            await this.db?.add(`guild-${guildid}.user-${member.id}.points`, points);
        });
    }

    /**
     * Start tracking a user
     *
     * @param {string} guild
     * @param {import("discord.js").GuildMember} user
     * @param {import("discord.js").VoiceState} newState
     * @memberof VoiceCount
     */
    start(guild, user, newState){
        this.trackedUsers.push({
            guild,
            user,
            newState,
            startTime: Date.now(),
        });
    }

    /**
     * Stop tracking a user
     *
     * @param {string} guild
     * @param {import("discord.js").GuildMember} user
     * @return {void}
     * @memberof VoiceCount
     */
    stop(guild, user){
        const trackedUser = this.trackedUsers.find(u => u.guild === guild && u.user === user);
        if (!trackedUser) return;

        const timeSpent = Date.now() - trackedUser.startTime;
        Log.info(`User ${user} spent ${timeSpent}ms in voice channel`);

        this.trackedUsers = this.trackedUsers.filter(u => u !== trackedUser);
    }
}

export default VoiceCount;
