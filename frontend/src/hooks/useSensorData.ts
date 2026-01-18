import { useQuery } from '@tanstack/react-query';
import { fetchSensorData } from '../api/fetchSensorData';
import { useSensorParams } from '../components/context/ParamContext';
import { useMockData } from '../components/context/MockDataContext';

export const useSensorData = () => {
    const { token, apiParams, latestValuesCount, measurementsPerHour, measurementsPerHourEnabled } = useSensorParams();
    const { user, bucket } = apiParams;
    const { useMock, getMockData } = useMockData();

    // Calculate the actual items count based on the mode
    const actualItemsCount = measurementsPerHourEnabled
        ? Math.max(2, measurementsPerHour)
        : Math.max(2, latestValuesCount);

    return useQuery({
        queryKey: ['sensorData', user, bucket, token, useMock, actualItemsCount],
        queryFn: () => fetchSensorData({
            getMockData: (useMock && getMockData) || null,
            user: user!,
            bucket: bucket!,
            token: token!,
            itemsCount: actualItemsCount
        }),
        enabled: useMock || (Boolean(token) && Boolean(user) && Boolean(bucket)),
        refetchInterval: 60 * 1000, // Refetch every 1 minute
    });
};
