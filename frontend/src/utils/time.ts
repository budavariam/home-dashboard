import { SensorReading } from "@/types";

export const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}.${day} ${timeStr}`;
};

/**
 * Apply timestamp fallback logic: if reading.ts differs from root ts by more than a day use the root ts (this handles cases where devices fail to sync with NTP and default to year 2000)
 */
export const fixTimestamps = (rootTs: number) => (reading: SensorReading) => {
    if (reading.ts) {
        const readingTs = +new Date(reading.ts);
        const diff = Math.abs(rootTs - readingTs);
        const oneDayInMs = 86400000; // 24 * 60 * 60 * 1000

        // If difference is more than a day, use root timestamp converted to ISO string
        if (diff > oneDayInMs) {
            reading.ts = new Date(rootTs).toISOString();
        }
    }
}