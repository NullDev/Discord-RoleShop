import path from "node:path";
import i18n from "i18n-light";
import { QuickDB } from "quick.db";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

i18n.configure({
    defaultLocale: "English_en",
    dir: path.resolve("./locales"),
    extension: ".json",
});

const db = new QuickDB({
    filePath: path.resolve("./data/guild_settings.sqlite"),
});

/**
 * @callback context
 * @param {string|null} guild
 * @param {boolean} [quantisize=false]
 * @returns {Promise<string>}
 */
/**
 * Translate a string
 * @param {array} args
 * @returns {context}
 */
const __ = (...args) => async(guild, quantisize = false) => {
    const locale = (await db.get(`guild-${guild}.locale`)) || "en";
    i18n.setLocale(locale);
    return quantisize ? i18n.__n(...args) : i18n.__(...args);
};

export default __;
