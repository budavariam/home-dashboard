import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSensorParams } from './components/context/ParamContext';
import { useMockData } from './components/context/MockDataContext';
import { Footer } from './components/Footer';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export const App = () => {
    const { t } = useTranslation();
    const { token, apiParams } = useSensorParams();
    const { useMock } = useMockData();
    const isAuthenticated = useMock || (token && apiParams.user && apiParams.bucket);

    return (
        <div className="min-h-screen">
            <nav className="bg-gray-800 text-white p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <ul className="flex gap-4 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                        <li className="flex-shrink-0">
                            <NavLink
                                to="."
                                className={({ isActive }: {isActive: boolean}) =>
                                    isActive ? 'text-blue-400' : 'hover:text-blue-400'
                                }
                            >
                                {t('NAV.HOME')}
                            </NavLink>
                        </li>
                        {isAuthenticated && (
                            <>
                                <li className="flex-shrink-0">
                                    <NavLink
                                        to="dashboard"
                                        className={({ isActive }: {isActive: boolean}) =>
                                            isActive ? 'text-blue-400' : 'hover:text-blue-400'
                                        }
                                    >
                                        {t('NAV.DASHBOARD')}
                                    </NavLink>
                                </li>
                                <li className="flex-shrink-0">
                                    <NavLink
                                        to="history"
                                        className={({ isActive }: {isActive: boolean}) =>
                                            isActive ? 'text-blue-400' : 'hover:text-blue-400'
                                        }
                                    >
                                        {t('NAV.HISTORY')}
                                    </NavLink>
                                </li>
                            </>
                        )}
                        <li className="flex-shrink-0">
                            <NavLink
                                to="mock"
                                className={({ isActive }: {isActive: boolean}) =>
                                    isActive ? 'text-blue-400' : 'hover:text-blue-400'
                                }
                            >
                                {t('NAV.MOCK')}
                            </NavLink>
                        </li>
                    </ul>
                    <div className="flex-shrink-0">
                        <LanguageSwitcher />
                    </div>
                </div>
            </nav>
            <main className="p-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
