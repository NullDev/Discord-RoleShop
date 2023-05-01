// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Logging utility class
 *
 * @class Log
 */
class Log {
    /**
     * Get neatly formatted date
     *
     * @return {string}
     * @static
     * @memberof Log
     */
    static #getDate(){
        const options = {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // eslint-disable-next-line
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        const date = new Intl.DateTimeFormat(
            "en-US",
            /** @type {Intl.DateTimeFormatOptions} */ (options),
        ).format(new Date());

        return "[" + date + "]";
    }

    /**
     * Log an error
     *
     * @static
     * @param {string} input
     * @param {*} [trace]
     * @memberof Log
     */
    static error(input, trace){
        console.log(" \x1b[41m\x1b[315m x \x1b[0m\x1b[31m [ERROR] " + this.#getDate() + " - " + input + "\x1b[0m");
        if (trace && trace.stack) console.log(" \x1b[41m\x1b[315m x \x1b[0m\x1b[31m [TRACE] " + this.#getDate() + " - " + trace.stack + "\x1b[0m");
    }

    /**
     * Log a warning
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static warn(input){
        console.log(" \x1b[43m\x1b[30m ! \x1b[0m\x1b[33m [WARN]  " + this.#getDate() + " - " + input + "\x1b[0m");
    }

    /**
     * Log an info
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static info(input){
        console.log(" \x1b[44m\x1b[30m i \x1b[0m\x1b[36m [INFO]  " + this.#getDate() + " - " + input + "\x1b[0m");
    }

    /**
     * Log a success
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static done(input){
        console.log(" \x1b[42m\x1b[30m ✓ \x1b[0m\x1b[32m [DONE]  " + this.#getDate() + " - " + input + "\x1b[0m");
    }
}

export default Log;
