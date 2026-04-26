import en from "./locales/en.json";
import sorani from "./locales/sorani.json";
import kurmanji from "./locales/kurmanji.json";

const translations: Record<string, any> = { en, sorani, kurmanji };

let currentLocale = "en";

function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current[key] === undefined) return undefined;
    current = current[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function t(key: string): string {
  const value = getNestedValue(translations[currentLocale], key);
  if (value) return value;
  const fallback = getNestedValue(translations.en, key);
  return fallback ?? key;
}

export function setLocale(locale: string) { currentLocale = locale; }
export function getLocale() { return currentLocale; }
