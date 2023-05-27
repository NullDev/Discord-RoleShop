import fs from "node:fs/promises";
import path from "node:path";

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
     * Log to file
     *
     * @param {string} input
     * @param {boolean} [error=false]
     * @memberof Log
     */
    static async #logTofile(input, error = false){
        const date = new Date();
        const logFile = `roleshop-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-output.log`;
        const fd = await fs.open(path.resolve("logs/" + logFile), "a");
        await fd.write(input + "\n");
        await fd.close();

        if (error){
            const errFile = `roleshop-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-errors.log`;
            const fe = await fs.open(path.resolve("logs/errors/" + errFile), "a");
            await fe.write(input + "\n");
            await fe.close();
        }
    }

    /**
     * Log an error
     *
     * @static
     * @param {string} input
     * @param {Error} [trace]
     * @memberof Log
     */
    static error(input, trace){
        const log = "[ERROR] " + this.#getDate() + " - " + input;
        const str = " \x1b[41m\x1b[315m x \x1b[0m\x1b[31m " + log + "\x1b[0m";
        console.log(str);
        this.#logTofile(log, true);
        if (trace && trace.stack){
            const eLog = "[TRACE] " + this.#getDate() + " - " + trace.stack;
            const eStr = " \x1b[41m\x1b[315m x \x1b[0m\x1b[31m " + eLog + "\x1b[0m";
            console.log(eStr);
            this.#logTofile(eLog, true);
        }
    }

    /**
     * Log a warning
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static warn(input){
        const log = "[WARN]  " + this.#getDate() + " - " + input;
        const str = " \x1b[43m\x1b[30m ! \x1b[0m\x1b[33m " + log + "\x1b[0m";
        console.log(str);
        this.#logTofile(log);
    }

    /**
     * Log a debug message
     * (only if NODE_ENV is set to development)
     *
     * @static
     * @param {string} input
     * @param {boolean} [force=false]
     * @memberof Log
     */
    static debug(input, force = false){
        if (process.env.NODE_ENV !== "development" && !force) return;
        const log = "[DEBUG] " + this.#getDate() + " - " + input;
        const str = " \x1b[45m\x1b[30m d \x1b[0m\x1b[35m " + log + "\x1b[0m";
        console.log(str);
        this.#logTofile(log);
    }

    /**
     * Log a wait message
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static wait(input){
        const log = "[WAIT]  " + this.#getDate() + " - " + input;
        const str = " \x1b[46m\x1b[30m ⧖ \x1b[0m\x1b[36m " + log + "\x1b[0m";
        console.log(str);
        this.#logTofile(log);
    }

    /**
     * Log an info
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static info(input){
        const log = "[INFO]  " + this.#getDate() + " - " + input;
        const str = " \x1b[44m\x1b[30m i \x1b[0m\x1b[36m " + log + "\x1b[0m";
        console.log(str);
        this.#logTofile(log);
    }

    /**
     * Log a success
     *
     * @static
     * @param {string} input
     * @memberof Log
     */
    static done(input){
        const log = "[DONE]  " + this.#getDate() + " - " + input;
        const str = " \x1b[42m\x1b[30m ✓ \x1b[0m\x1b[32m " + log + "\x1b[0m";
        console.log(str);
        this.#logTofile(log);
    }
}

export default Log;
