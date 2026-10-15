import React, { createContext, useContext, useState } from 'react';
import { translations, type Language, type TranslationDictionary } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'az',
  setLanguage: () => {},
  t: translations.az,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('chrono_lang') as Language;
    if (saved && (saved === 'az' || saved === 'en' || saved === 'tr')) {
      return saved;
    }
    return 'az'; // Default to Azerbaijani
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('chrono_lang', lang);
  };

  const t = translations[language] || translations.az;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
