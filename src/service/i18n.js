import path from "node:path";
import i18n from "i18n-light";
import { QuickDB } from "quick.db";

i18n.configure({
    defaultLocale: "en",
    dir: path.resolve("./locales"),
    extension: ".json",
});

const db = new QuickDB();

const __ = (...args) => async guild => {
    const locale = (await db.get(`${guild}.locale`)) || "en";
    console.log(locale);
    i18n.setLocale(locale);
    return i18n.__(...args);
};

export default __;
