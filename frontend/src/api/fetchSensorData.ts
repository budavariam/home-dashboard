import axios from 'axios';
import { SensorReading, DEFAULT_VALUE, ApiResponse } from '../types';

interface FetchDataParams {
    getMockData: (() => ApiResponse[]) | null,
    user: string;
    bucket: string;
    token: string;
}

export const fetchSensorData = async ({ getMockData, user, bucket, token }: FetchDataParams): Promise<SensorReading[]> => {
    if (getMockData) {
        const data = getMockData()
        if (data.length === 0) {
            return [DEFAULT_VALUE]
        }
        return data[0]?.val?.readings ?? DEFAULT_VALUE
    }

    if (!user || !bucket || !token) {
        throw new Error('Missing API parameters or token.');
    }

    const url = `https://api.thinger.io/v1/users/${user}/buckets/${bucket}/data?items=1&sort=desc`;
    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.length === 0) {
        throw new Error('Empty bucket.');
    }

    return response.data[0]?.val?.readings ?? DEFAULT_VALUE;
};