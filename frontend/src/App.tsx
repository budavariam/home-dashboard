import { Outlet, NavLink } from 'react-router-dom';
import { useSensorParams } from './components/context/ParamContext';
import { useMockData } from './components/context/MockDataContext';
import { Footer } from './components/Footer';

export const App = () => {
    const { token, apiParams } = useSensorParams();
    const { useMock } = useMockData();
    const isAuthenticated = useMock || (token && apiParams.user && apiParams.bucket);

    return (
        <div className="min-h-screen ">
            <nav className="bg-gray-800 text-white p-4">
                <ul className="flex gap-4">
                    <li>
                        <NavLink
                            to="."
                            className={({ isActive }: {isActive: boolean}) =>
                                isActive ? 'text-blue-400' : 'hover:text-blue-400'
                            }
                        >
                            Home
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
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="history"
                                    className={({ isActive }: {isActive: boolean}) =>
                                        isActive ? 'text-blue-400' : 'hover:text-blue-400'
                                    }
                                >
                                    History
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
                            Mock
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <main className="p-4">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};