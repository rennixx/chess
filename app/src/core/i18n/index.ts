import i18n from "i18n-js";
import en from "./locales/en.json";
import sorani from "./locales/sorani.json";
import kurmanji from "./locales/kurmanji.json";

i18n.fallbacks = true;
i18n.translations = { en, sorani, kurmanji };
i18n.defaultLocale = "en";
i18n.locale = "en";

export function setLocale(locale: string) { i18n.locale = locale; }
export function t(key: string, params?: object): string { return i18n.t(key, params); }
export { i18n };
