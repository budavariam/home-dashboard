import axios from "axios";
import { ApiResponse } from "@/types";
import { TimeRange } from "../types";

const TIME_RANGES: Record<TimeRange, number> = {
    "1h": 3600000,
    "6h": 21600000,
    "12h": 43200000,
    "24h": 86400000
};

export const fetchHistoricalData = async (
    getMockData: (() => ApiResponse[]) | null,
    timeRange: TimeRange,
    user: string | null,
    bucket: string | null,
    token: string | null
): Promise<ApiResponse[]> => {
    if (getMockData) {
        return getMockData()
    }
    if (!user || !bucket || !token) {
        throw new Error("Missing API parameters or token.");
    }

    const now = Date.now();
    const timeRangeMs = TIME_RANGES[timeRange];
    const min_ts = now - timeRangeMs;
    const max_ts = now;

    const url = `https://backend.thinger.io/v1/users/${user}/buckets/${bucket}/data`;

    const response = await axios.get<ApiResponse[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            sort: "desc",
            min_ts,
            max_ts
        }
    });

    return response.data;
};
