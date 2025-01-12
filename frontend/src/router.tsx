import { createHashRouter, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { App } from './App';
import { useSensorParams } from './components/context/ParamContext';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import SensorDataPage from './pages/SensorDataPage';
import { useMockData } from './components/context/MockDataContext';

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { useMock } = useMockData();
    const { token, apiParams } = useSensorParams();

    if (useMock) {
        return children
    }

    if (!token || !(apiParams?.user ?? false) || !(apiParams?.bucket ?? false)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export const router = createHashRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <LandingPage />,
            },
            {
                path: 'dashboard',
                element: (
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'history',
                element: (
                    <ProtectedRoute>
                        <HistoryPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'mock',
                element: (
                    <SensorDataPage />
                ),
            },
        ],
    },
], {
    // basename: '/home-dashboard'
});