import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/translations';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  showIcon = true,
}) => {
  const { language, setLanguage } = useLanguage();

  const langs: { code: Language; label: string }[] = [
    { code: 'az', label: 'AZ' },
    { code: 'en', label: 'EN' },
    { code: 'tr', label: 'TR' },
  ];

  return (
    <div className={`lang-selector-group ${className}`}>
      {showIcon && <Globe size={16} className="text-cyan mr-1" />}
      {langs.map((l) => (
        <button
          key={l.code}
          className={`lang-pill-btn ${language === l.code ? 'active' : ''}`}
          onClick={() => setLanguage(l.code)}
          title={`Switch to ${l.label}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};
