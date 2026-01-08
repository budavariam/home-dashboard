import { useQuery } from '@tanstack/react-query';
import { fetchSensorData } from '../api/fetchSensorData';
import { useSensorParams } from '../components/context/ParamContext';
import { useMockData } from '../components/context/MockDataContext';

export const useSensorData = () => {
    const { token, apiParams, latestValuesCount } = useSensorParams();
    const { user, bucket } = apiParams;
    const { useMock, getMockData } = useMockData();

    return useQuery({
        queryKey: ['sensorData', user, bucket, token, useMock, latestValuesCount],
        queryFn: () => fetchSensorData({
            getMockData: (useMock && getMockData) || null,
            user: user!,
            bucket: bucket!,
            token: token!,
            itemsCount: latestValuesCount
        }),
        enabled: useMock || (Boolean(token) && Boolean(user) && Boolean(bucket)),
        refetchInterval: 60 * 1000, // Refetch every 1 minute
    });
};
