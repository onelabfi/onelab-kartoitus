'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { type Lang, translations, t as translate } from './i18n';

type LangContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof translations['fi']) => string;
};

const LangContext = createContext<LangContextType>({
  lang: 'fi',
  setLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fi');

  useEffect(() => {
    // Only use stored preference, never auto-detect browser language
    const stored = localStorage.getItem('lang') as Lang;
    if (stored && ['fi', 'en', 'sv'].includes(stored)) {
      setLangState(stored);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  const t = (key: keyof typeof translations['fi']) => translate(lang, key);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
