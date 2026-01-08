import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useSensorParams } from './context/ParamContext';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const { defaultLanguage } = useSensorParams();

  useEffect(() => {
    if (defaultLanguage && defaultLanguage !== i18n.language) {
      i18n.changeLanguage(defaultLanguage);
    }
  }, [defaultLanguage, i18n]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hu' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-all leading-none"
      title={i18n.language === 'en' ? t('LANGUAGE_SWITCHER.SWITCH_TO_HUNGARIAN') : t('LANGUAGE_SWITCHER.SWITCH_TO_ENGLISH')}
      aria-label={i18n.language === 'en' ? t('LANGUAGE_SWITCHER.SWITCH_TO_HUNGARIAN') : t('LANGUAGE_SWITCHER.SWITCH_TO_ENGLISH')}
    >
      {i18n.language === 'en' ? '🇭🇺' : '🇬🇧'}
    </button>
  );
};
