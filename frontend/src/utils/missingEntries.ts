import { GroupedData } from '../types';

function parseFormattedTimestamp(ts: string): number {
    // Format: "MM.DD HH:mm"
    const [datePart, timePart] = ts.split(' ');
    if (!datePart || !timePart) return 0;
    const [month, day] = datePart.split('.').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    return new Date(2000, month - 1, day, hours, minutes).getTime();
}

function formatSyntheticTimestamp(ms: number): string {
    const date = new Date(ms);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}.${day} ${hours}:${minutes}`;
}

export interface AugmentedGroupedData {
    data: GroupedData;
    missingIndices: Set<number>;
}

export function augmentWithMissingEntries(groupedData: GroupedData): AugmentedGroupedData {
    const firstDevice = Object.values(groupedData)[0];
    if (!firstDevice || firstDevice.timestamps.length < 3) {
        return { data: groupedData, missingIndices: new Set() };
    }

    const timestamps = firstDevice.timestamps;
    const times = timestamps.map(parseFormattedTimestamp);

    const intervals: number[] = [];
    for (let i = 1; i < times.length; i++) {
        const diff = times[i] - times[i - 1];
        if (diff > 0) intervals.push(diff);
    }

    if (intervals.length === 0) {
        return { data: groupedData, missingIndices: new Set() };
    }

    const sorted = [...intervals].sort((a, b) => a - b);
    const medianInterval = sorted[Math.floor(sorted.length / 2)];
    const threshold = medianInterval * 1.5;

    const augmentedTimestamps: string[] = [];
    const missingIndices = new Set<number>();

    for (let i = 0; i < timestamps.length; i++) {
        augmentedTimestamps.push(timestamps[i]);

        if (i < timestamps.length - 1) {
            const gap = times[i + 1] - times[i];
            if (gap > threshold) {
                missingIndices.add(augmentedTimestamps.length);
                augmentedTimestamps.push(formatSyntheticTimestamp(Math.floor((times[i] + times[i + 1]) / 2)));
            }
        }
    }

    if (missingIndices.size === 0) {
        return { data: groupedData, missingIndices: new Set() };
    }

    const augmentedData: GroupedData = {};

    for (const [device, deviceData] of Object.entries(groupedData)) {
        const newHum: (number | null)[] = [];
        const newTmp: (number | null)[] = [];
        const newBat: (number | null)[] = [];

        let oldIdx = 0;
        for (let newIdx = 0; newIdx < augmentedTimestamps.length; newIdx++) {
            if (missingIndices.has(newIdx)) {
                newHum.push(null);
                newTmp.push(null);
                newBat.push(null);
            } else {
                newHum.push(deviceData.hum[oldIdx] ?? null);
                newTmp.push(deviceData.tmp[oldIdx] ?? null);
                newBat.push(deviceData.bat[oldIdx] ?? null);
                oldIdx++;
            }
        }

        augmentedData[device] = {
            hum: newHum,
            tmp: newTmp,
            bat: newBat,
            timestamps: augmentedTimestamps,
        };
    }

    return { data: augmentedData, missingIndices };
}
