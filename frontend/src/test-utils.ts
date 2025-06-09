import { GroupedData, MetricKey } from './types';

export const createMockGroupedData = (
    deviceCount: number = 3,
    timestampCount: number = 12,
    startHour: number = 8
): GroupedData => {
    const timestamps = Array.from({ length: timestampCount }, (_, i) => {
        const hour = startHour + i;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    const devices = Array.from({ length: deviceCount }, (_, i) => `device${(i + 1).toString().padStart(3, '0')}`);
    const groupedData: GroupedData = {};

    devices.forEach(device => {
        groupedData[device] = {
            hum: timestamps.map((_, i) => 45 + Math.random() * 30 + Math.sin(i * 0.5) * 10),
            tmp: timestamps.map((_, i) => 20 + Math.random() * 10 + Math.cos(i * 0.3) * 5),
            bat: timestamps.map(() => 85 + Math.random() * 15),
            timestamps,
        };
    });

    return groupedData;
};

export const createMockMappings = (devices: string[]): Record<string, string> => {
    const roomNames = ['Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 'Office', 'Garage'];
    return devices.reduce((acc, device, index) => {
        acc[device] = `${roomNames[index % roomNames.length]} Sensor`;
        return acc;
    }, {} as Record<string, string>);
};

export const createMockColorMap = (devices: string[]): Record<string, string> => {
    const colors = ["#3b82f6", "#f97316", "#10b981", "#eab308", "#8b5cf6", "#f59e0b"];
    return devices.reduce((acc, device, index) => {
        acc[device] = colors[index % colors.length];
        return acc;
    }, {} as Record<string, string>);
};

export const createDataWithMissingValues = (
    deviceCount: number = 2,
    timestampCount: number = 10,
    missingPercentage: number = 0.2
): GroupedData => {
    const baseData = createMockGroupedData(deviceCount, timestampCount);

    Object.keys(baseData).forEach(device => {
        (['hum', 'tmp', 'bat'] as MetricKey[]).forEach(metric => {
            baseData[device][metric] = baseData[device][metric].map(value =>
                Math.random() < missingPercentage ? null : value
            );
        });
    });

    return baseData;
};