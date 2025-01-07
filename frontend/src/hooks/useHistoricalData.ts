import { useQuery } from "@tanstack/react-query";
import { useSensorParams } from "../components/context/ParamContext";
import { TimeRange } from "../types";
import { fetchHistoricalData } from "../api/fetchHistoricalData";
import { useMockData } from "../components/context/MockDataContext";

export const useHistoricalData = (timeRange: TimeRange) => {
    const { token, apiParams } = useSensorParams();
    const { user, bucket } = apiParams;
    const { useMock, getMockData } = useMockData()

    return useQuery({
        queryKey: ["historicalData", timeRange, user, bucket, useMock],
        queryFn: () => fetchHistoricalData((useMock && getMockData) || null, timeRange, user, bucket, token),
        enabled: useMock || (Boolean(token) && Boolean(user) && Boolean(bucket))
    });
};