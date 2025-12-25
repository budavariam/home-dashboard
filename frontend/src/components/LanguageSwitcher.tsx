import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded transition-all ${
          i18n.language === 'en' 
            ? 'bg-blue-500 text-white scale-110' 
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
        title="English"
        aria-label="Switch to English"
      >
        🇬🇧
      </button>
      <button
        onClick={() => changeLanguage('hu')}
        className={`px-2 py-1 rounded transition-all ${
          i18n.language === 'hu' 
            ? 'bg-blue-500 text-white scale-110' 
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
        title="Magyar"
        aria-label="Váltás magyar nyelvre"
      >
        🇭🇺
      </button>
    </div>
  );
};
