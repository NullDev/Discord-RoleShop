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
            const {guild} = trackedUser;
            const {user} = trackedUser;

            const isMuted = trackedUser.voice.mute;
            const isDeaf = trackedUser.voice.deaf;
            const isIdle = trackedUser.voice.selfDeaf || trackedUser.voice.selfMute || trackedUser.voice.selfVideo;

            const timeSpent = Date.now() - trackedUser.startTime;
            const minutesSpent = Math.floor(timeSpent / 60000);

            if (minutesSpent >= 300) return;

            const points = (minutesSpent * 0.5) * (isIdle ? 1 : 2);
        });
    }

    /**
     * Start tracking a user
     *
     * @param {string} guild
     * @param {import("discord.js").GuildMember} user
     * @memberof VoiceCount
     */
    start(guild, user){
        this.trackedUsers.push({
            guild,
            user,
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
