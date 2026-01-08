import axios from 'axios';
import { SensorReading, DEFAULT_VALUE, ApiResponse } from '../types';
import { fixTimestamps } from '../utils/time';

interface FetchDataParams {
    getMockData: (() => ApiResponse[]) | null,
    user: string;
    bucket: string;
    token: string;
    itemsCount?: number;
}

export const fetchSensorData = async ({ getMockData, user, bucket, token, itemsCount = 1 }: FetchDataParams): Promise<SensorReading[]> => {
    if (getMockData) {
        const data = getMockData()
        if (data.length === 0) {
            return [DEFAULT_VALUE]
        }
        // Process all items up to itemsCount
        const allReadings: SensorReading[] = [];
        for (const item of data.slice(0, itemsCount)) {
            const rootTs = item.ts;
            const device = item.val?.device;
            const readings = item.val?.readings ?? [];

            // Apply fixTimestamps and add device info to each reading
            readings.forEach(reading => {
                fixTimestamps(rootTs)(reading);
                if (device) {
                    reading.device = device;
                }
            });

            allReadings.push(...readings);
        }
        return allReadings.length > 0 ? allReadings : [DEFAULT_VALUE];
    }

    if (!user || !bucket || !token) {
        throw new Error('Missing API parameters or token.');
    }

    const url = `https://api.thinger.io/v1/users/${user}/buckets/${bucket}/data?items=${itemsCount}&sort=desc`;
    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.length === 0) {
        throw new Error('Empty bucket.');
    }

    // Process all items up to itemsCount
    const allReadings: SensorReading[] = [];
    for (const item of response.data.slice(0, itemsCount)) {
        const rootTs = item.ts;
        const device = item.val?.device;
        const readings = item.val?.readings ?? [];

        // Apply fixTimestamps and add device info to each reading
        readings.forEach((reading: SensorReading) => {
            fixTimestamps(rootTs)(reading);
            if (device) {
                reading.device = device;
            }
        });

        allReadings.push(...readings);
    }

    return allReadings.length > 0 ? allReadings : [DEFAULT_VALUE];
};