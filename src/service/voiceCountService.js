class VoiceCount {
    constriuctor(){
        this.trackedUsers = [];
        setInterval(() => {
            this.#voicePointsWorker();
        }, 5000);
    }

    #voicePointsWorker(){

    }

    start(guild, user){
        this.trackedUsers.push({
            guild,
            user,
            startTime: Date.now(),
        });
    }

    stop(guild, user){
        const trackedUser = this.trackedUsers.find(u => u.guild === guild && u.user === user);
        if (!trackedUser) return;

        const timeSpent = Date.now() - trackedUser.startTime;
        this.trackedUsers = this.trackedUsers.filter(u => u !== trackedUser);
    }
}

export default VoiceCount;
