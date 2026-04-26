import { I18n } from "i18n-js";
import en from "./locales/en.json";
import sorani from "./locales/sorani.json";
import kurmanji from "./locales/kurmanji.json";

const i18n = new I18n({ en, sorani, kurmanji });
i18n.defaultLocale = "en";
i18n.locale = "en";
i18n.fallbacks = true;

export function setLocale(locale: string) { i18n.locale = locale; }
export function t(key: string, params?: object): string { return i18n.t(key, params); }
export { i18n };
