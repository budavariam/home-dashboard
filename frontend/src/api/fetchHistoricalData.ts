import axios from "axios";
import { ApiResponse } from "@/types";
import { TimeRange } from "../types";

const TIME_RANGES: Record<TimeRange, number> = {
    "1h": 3600 * 1000,
    "6h": 6 * 3600 * 1000,
    "12h": 12 * 3600 * 1000,
    "24h": 24 * 3600 * 1000,
    "48h": 48 * 3600 * 1000,
    "1w": 7 * 24 * 3600 * 1000,
    "2w": 14 * 24 * 3600 * 1000,
    "1m": 30 * 24 * 3600 * 1000,
};

export const fetchHistoricalData = async (
    getMockData: (() => ApiResponse[]) | null,
    timeRange: TimeRange,
    user: string | null,
    bucket: string | null,
    token: string | null,
    compare?: boolean
): Promise<ApiResponse[]> => {
    if (getMockData) {
        return getMockData()
    }
    if (!user || !bucket || !token) {
        throw new Error("Missing API parameters or token.");
    }

    const now = Date.now();
    let timeRangeMs = TIME_RANGES[timeRange];
    if (compare) {
        timeRangeMs *= 2;
    }
    const min_ts = now - timeRangeMs;
    const max_ts = now;

    const url = `https://backend.thinger.io/v1/users/${user}/buckets/${bucket}/data`;

    const response = await axios.get<ApiResponse[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            sort: "desc",
            items: 4 * timeRangeMs / (3600 * 1000),
            min_ts,
            max_ts
        }
    });
    if (response.data.length === 0) {
        return []
    }
    return response.data.reverse();
};
