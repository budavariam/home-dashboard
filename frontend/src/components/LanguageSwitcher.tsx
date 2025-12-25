
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hu' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-all text-2xl"
      title={i18n.language === 'en' ? 'Switch to Magyar' : 'Switch to English'}
      aria-label={i18n.language === 'en' ? 'Switch to Magyar' : 'Switch to English'}
    >
      {i18n.language === 'en' ? '🇭🇺' : '🇬🇧'}
    </button>
  );
};
