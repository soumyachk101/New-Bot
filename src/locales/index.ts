import en from './en.json' with { type: 'json' };
import hi from './hi.json' with { type: 'json' };
import mr from './mr.json' with { type: 'json' };

type TranslationKeys = keyof typeof en;
type Translations = Record<TranslationKeys, string>;

const translations: Record<string, Translations> = { en, hi, mr };

export function t(key: string, lang: string, vars?: Record<string, string>): string {
  const locale = translations[lang] ?? translations['en'];
  let text = locale[key as keyof Translations] ?? en[key as keyof Translations] ?? key;
  
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`{{${k}}}`, 'g'), v);
    }
  }
  
  return text;
}

export function isValidLanguage(lang: string): boolean {
  return lang in translations;
}

export const supportedLanguages = ['en', 'hi', 'mr'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

export default { t, isValidLanguage, supportedLanguages };
