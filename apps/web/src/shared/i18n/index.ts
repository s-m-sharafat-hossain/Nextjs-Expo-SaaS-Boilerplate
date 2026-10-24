// apps/web/src/shared/i18n/index.ts
import en from "./locales/en.json";
import bn from "./locales/bn.json";
import ar from "./locales/ar.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import zh from "./locales/zh.json";
import ja from "./locales/ja.json";

export const SUPPORTED_LOCALES = [
  { code: "en", name: "English", flag: "🇺🇸", dir: "ltr" },
  { code: "bn", name: "বাংলা (Bengali)", flag: "🇧🇩", dir: "ltr" },
  { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦", dir: "rtl" },
  { code: "es", name: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "fr", name: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "zh", name: "中文 (Chinese)", flag: "🇨🇳", dir: "ltr" },
  { code: "ja", name: "日本語 (Japanese)", flag: "🇯🇵", dir: "ltr" },
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]["code"];

export const dictionaries: Record<SupportedLocale, any> = {
  en,
  bn,
  ar,
  es,
  fr,
  de,
  zh,
  ja,
};

/**
 * Returns true if the selected locale requires Right-to-Left (RTL) layout
 */
export function isRtlLocale(locale: string): boolean {
  return locale === "ar" || locale === "he" || locale === "fa";
}

/**
 * Get translation string by dotted key path (e.g. "nav.dashboard", "common.loading")
 */
export function getTranslation(locale: SupportedLocale | string, path: string): string {
  const dict = dictionaries[locale as SupportedLocale] || dictionaries.en;
  const parts = path.split(".");
  let current: any = dict;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      // Fallback to English
      let fallback: any = dictionaries.en;
      for (const p of parts) {
        if (fallback && typeof fallback === "object" && p in fallback) {
          fallback = fallback[p];
        } else {
          return path;
        }
      }
      return typeof fallback === "string" ? fallback : path;
    }
  }

  return typeof current === "string" ? current : path;
}

/**
 * DeepL / Google Translate API auto-translation engine integration
 */
export class TranslationService {
  static async translateText(
    text: string,
    targetLang: string,
    sourceLang = "en"
  ): Promise<string> {
    const apiKey = process.env.DEEPL_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY;

    // If live API key configured, dispatch to DeepL API
    if (apiKey && process.env.DEEPL_API_KEY) {
      try {
        const res = await fetch("https://api-free.deepl.com/v2/translate", {
          method: "POST",
          headers: {
            Authorization: `DeepL-Auth-Key ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: [text],
            target_lang: targetLang.toUpperCase(),
            source_lang: sourceLang.toUpperCase(),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          return data.translations?.[0]?.text || text;
        }
      } catch (err) {
        console.warn("[DeepL] Translation failed, returning original text:", err);
      }
    }

    return text;
  }
}
