import Log from "./log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Message spam filter
 *
 * @class SpamFilter
 */
class SpamFilter {
    /**
     *  Creates an instance of SpamFilter.
     *
     * @param {Number} alpha - smoothing factor (less is more strict)
     * @param {Number} windowSize - last n messages to consider
     * @memberof SpamFilter
     */
    constructor(alpha, windowSize){
        this.alpha = alpha;
        this.windowSize = windowSize;
        this.smoothedTimeDifferences = new Map();
        this.lastMessageTimestamps = new Map();
        this.timeDifferencesBuffer = [];

        Log.debug(`Spam filter initialized with alpha=${alpha} and windowSize=${windowSize}`, true);

        setInterval(() => this.#removeOldEntries(), 10 * 60 * 1000);
    }

    /**
     * Update the moving average
     *
     * @param {Number} timeDifference
     * @return {Number}
     * @memberof SpamFilter
     */
    #updateMovingAverage(timeDifference){
        this.timeDifferencesBuffer.push(timeDifference);
        if (this.timeDifferencesBuffer.length > this.windowSize){
            this.timeDifferencesBuffer.shift();
        }
        const sum = this.timeDifferencesBuffer.reduce((a, b) => a + b, 0);
        return sum / this.timeDifferencesBuffer.length;
    }

    /**
     * Wipe old entries
     *
     * @memberof SpamFilter
     */
    #removeOldEntries(){
        const currentTimestamp = Math.floor(Date.now() / 1000);
        for (const [userId, lastMessageTimestamp] of this.lastMessageTimestamps.entries()){
            if (currentTimestamp - lastMessageTimestamp > (5 * 60 * 1000)){
                this.lastMessageTimestamps.delete(userId);
                this.smoothedTimeDifferences.delete(userId);
            }
        }
    }

    /**
     * Check if a message should be filtered
     *
     * @param {String} userId
     * @param {Number} currentTimestamp
     * @return {Boolean}
     * @memberof SpamFilter
     */
    shouldFilterMessage(userId, currentTimestamp){
        const lastMessageTimestamp = this.lastMessageTimestamps.get(userId);
        if (!lastMessageTimestamp){
            this.lastMessageTimestamps.set(userId, currentTimestamp);
            return false;
        }

        const timeDifference = currentTimestamp - lastMessageTimestamp;
        this.lastMessageTimestamps.set(userId, currentTimestamp);

        const smoothedTimeDifference = this.smoothedTimeDifferences.get(userId) || timeDifference;
        const updatedSmoothedTimeDifference = this.alpha * timeDifference + (1 - this.alpha) * smoothedTimeDifference;
        this.smoothedTimeDifferences.set(userId, updatedSmoothedTimeDifference);

        const movingAverage = this.#updateMovingAverage(timeDifference);

        return updatedSmoothedTimeDifference < movingAverage;
    }
}

export default SpamFilter;
