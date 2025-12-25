import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();
    
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-4 text-center">
            <div className="container mx-auto px-4">
                <p className="text-sm">
                    {t('FOOTER.DEVELOPED_BY')} <span className="font-medium text-gray-800 dark:text-gray-200">Mátyás Budavári</span>
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-sm">
                    <p>
                        {t('FOOTER.SOURCE_CODE')}{' '}
                        <a
                            href="https://github.com/budavariam/home-dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {t('FOOTER.GITHUB')}
                        </a>
                    </p>
                    <span className="hidden sm:inline">•</span>
                    <p>
                        <a
                            href="/home-dashboard/storybook/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            {t('FOOTER.COMPONENT_DOCS')}
                        </a>
                    </p>
                </div>
                <p className="text-xs mt-2">
                    &copy; {new Date().getFullYear()} {t('FOOTER.COPYRIGHT')}
                </p>
            </div>
        </footer>
    );
};
