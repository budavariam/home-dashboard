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
        <div className="min-h-screen ">
            <nav className="bg-gray-800 text-white p-4">
                <div className="flex justify-between items-center">
                    <ul className="flex gap-4">
                        <li>
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
                                <li>
                                    <NavLink
                                        to="dashboard"
                                        className={({ isActive }: {isActive: boolean}) =>
                                            isActive ? 'text-blue-400' : 'hover:text-blue-400'
                                        }
                                    >
                                        {t('NAV.DASHBOARD')}
                                    </NavLink>
                                </li>
                                <li>
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
                        <li>
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
                    <LanguageSwitcher />
                </div>
            </nav>
            <main className="p-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
