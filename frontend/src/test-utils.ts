import { DeviceData, GroupedData, MetricKey } from './types';

export const mockDevices = ['device001', 'device002', 'device003', 'device004'];
export const mockMappings = {
    'device001': 'Living Room Sensor',
    'device002': 'Kitchen Sensor',
    'device003': 'Bedroom Sensor',
    'device004': 'Bathroom Sensor',
};
export const mockColorMap = {
    'device001': '#3b82f6',
    'device002': '#f97316',
    'device003': '#10b981',
    'device004': '#eab308',
};


const generateMockData = () => {
    const timestamps = Array.from({ length: 12 }, (_, i) => {
        const hour = 8 + i;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    const devices = ['device001', 'device002', 'device003'];
    const groupedData: { [k: string]: DeviceData } = {} as { [k: string]: DeviceData };

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

export const mockLineChartData = generateMockData();

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

/**
 * Generate realistic mock table data with configurable patterns
 * Simulates realistic sensor behavior with daily cycles and device-specific offsets
 */
export const generateMockTableData = (
    deviceCount: number = 3,
    timestampCount: number = 24,
    includeNulls: boolean = false,
    startHour: number = 0
): GroupedData => {
    const devices = Array.from({ length: deviceCount }, (_, i) =>
        `device${(i + 1).toString().padStart(3, '0')}`
    );

    const timestamps = Array.from({ length: timestampCount }, (_, i) => {
        const hour = (startHour + i) % 24;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    const groupedData: GroupedData = {};

    devices.forEach((device, deviceIndex) => {
        const humValues: (number | null)[] = [];
        const tmpValues: (number | null)[] = [];
        const batValues: (number | null)[] = [];

        timestamps.forEach((_, timeIndex) => {
            // Generate realistic patterns with some variation per device
            const timeOfDay = timeIndex / timestampCount;
            const deviceOffset = deviceIndex * 5;

            // Humidity: 40-70%, with daily variation (higher at night)
            const humBase = 45 + deviceOffset + Math.sin(timeOfDay * Math.PI * 2) * 15;
            const humNoise = Math.random() * 10 - 5;
            humValues.push(
                includeNulls && Math.random() < 0.1 ? null : Math.max(30, Math.min(80, humBase + humNoise))
            );

            // Temperature: 18-28°C, with daily variation (cooler at night)
            const tmpBase = 20 + deviceOffset / 2 + Math.cos(timeOfDay * Math.PI * 2 + deviceIndex) * 4;
            const tmpNoise = Math.random() * 3 - 1.5;
            tmpValues.push(
                includeNulls && Math.random() < 0.1 ? null : Math.max(15, Math.min(32, tmpBase + tmpNoise))
            );

            // Battery: 70-100%, slowly decreasing over time
            const batBase = 95 - (timeIndex / timestampCount) * 20 - deviceIndex * 3;
            const batNoise = Math.random() * 2 - 1;
            batValues.push(
                includeNulls && Math.random() < 0.08 ? null : Math.max(65, Math.min(100, batBase + batNoise))
            );
        });

        groupedData[device] = {
            hum: humValues,
            tmp: tmpValues,
            bat: batValues,
            timestamps,
        };
    });

    return groupedData;
};

/**
 * Pre-generated datasets for common table scenarios
 */
export const mockTableDataFull = generateMockTableData(3, 24, false, 8);

export const mockTableDataWithNulls: GroupedData = {
    device001: {
        hum: [45, null, 52, 48, null, 51, 49, null, 53, 47, 50, null],
        tmp: [22, 23, null, 24, 23, null, 25, 24, 23, null, 22, 23],
        bat: [90, 89, 88, null, 86, 85, null, 83, 82, 81, null, 79],
        timestamps: Array.from({ length: 12 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`),
    },
    device002: {
        hum: [null, 48, 49, null, 52, 50, 51, null, 49, 48, null, 47],
        tmp: [null, 21, 22, 23, null, 24, 23, 22, null, 21, 22, null],
        bat: [85, null, 83, 82, 81, null, 79, 78, 77, null, 75, 74],
        timestamps: Array.from({ length: 12 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`),
    },
};

export const mockTableDataSingleDevice: GroupedData = {
    device001: {
        hum: Array.from({ length: 12 }, (_, i) => 45 + Math.sin(i * 0.5) * 10 + Math.random() * 5),
        tmp: Array.from({ length: 12 }, (_, i) => 22 + Math.cos(i * 0.3) * 3 + Math.random() * 2),
        bat: Array.from({ length: 12 }, (_, i) => 95 - i * 1.5 + Math.random() * 2),
        timestamps: Array.from({ length: 12 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`),
    },
};

export const mockTableDataLarge = generateMockTableData(5, 48, false, 0);

/**
 * Generate data with extreme values for edge case testing
 */
export const createExtremeValueData = (deviceCount: number = 2): GroupedData => {
    const timestamps = Array.from({ length: 8 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);
    const devices = Array.from({ length: deviceCount }, (_, i) => `device${(i + 1).toString().padStart(3, '0')}`);
    const groupedData: GroupedData = {};

    devices.forEach((device, index) => {
        if (index === 0) {
            // Device with minimum values
            groupedData[device] = {
                hum: [30, 31, 30.5, 30, 29.8, 30.2, 30, 30.1],
                tmp: [15, 15.5, 15.2, 15, 15.3, 15.1, 15, 15.2],
                bat: [70, 69.5, 69, 68.5, 68, 67.5, 67, 66.5],
                timestamps,
            };
        } else {
            // Device with maximum values
            groupedData[device] = {
                hum: [79, 79.5, 80, 79.8, 79.9, 80, 79.7, 79.9],
                tmp: [31, 31.5, 32, 31.8, 31.9, 32, 31.7, 31.9],
                bat: [99, 99.5, 100, 99.8, 99.9, 100, 99.7, 99.9],
                timestamps,
            };
        }
    });

    return groupedData;
};

/**
 * Generate data with all null values for a specific metric
 */
export const createAllNullMetricData = (metric: MetricKey): GroupedData => {
    const timestamps = Array.from({ length: 8 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);
    const devices = ['device001', 'device002'];
    const groupedData: GroupedData = {};

    devices.forEach(device => {
        const normalValues = Array.from({ length: 8 }, () => 50 + Math.random() * 10);
        const nullValues = Array.from({ length: 8 }, () => null);

        groupedData[device] = {
            hum: metric === 'hum' ? nullValues : normalValues,
            tmp: metric === 'tmp' ? nullValues : normalValues,
            bat: metric === 'bat' ? nullValues : normalValues,
            timestamps,
        };
    });

    return groupedData;
};

/**
 * Generate data with sporadic gaps (clustered nulls)
 */
export const createSporadicGapsData = (deviceCount: number = 3): GroupedData => {
    const baseData = generateMockTableData(deviceCount, 24, false);

    Object.keys(baseData).forEach((device, deviceIndex) => {
        // Create a gap period unique to each device
        const gapStart = 8 + deviceIndex * 4;
        const gapEnd = gapStart + 3;

        (['hum', 'tmp', 'bat'] as MetricKey[]).forEach(metric => {
            baseData[device][metric] = baseData[device][metric].map((value, index) =>
                index >= gapStart && index <= gapEnd ? null : value
            );
        });
    });

    return baseData;
};

/**
 * Generate data with consistent values (for testing statistics)
 */
export const createConsistentValueData = (): GroupedData => {
    const timestamps = Array.from({ length: 10 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);

    return {
        device001: {
            hum: Array(10).fill(50.0),
            tmp: Array(10).fill(22.0),
            bat: Array(10).fill(85.0),
            timestamps,
        },
        device002: {
            hum: Array(10).fill(55.0),
            tmp: Array(10).fill(24.0),
            bat: Array(10).fill(90.0),
            timestamps,
        },
    };
};

/**
 * Generate data with monotonic trends (for testing sorting)
 */
export const createMonotonicData = (direction: 'ascending' | 'descending' = 'ascending'): GroupedData => {
    const timestamps = Array.from({ length: 10 }, (_, i) => `${(8 + i).toString().padStart(2, '0')}:00`);
    const multiplier = direction === 'ascending' ? 1 : -1;

    return {
        device001: {
            hum: Array.from({ length: 10 }, (_, i) => 40 + i * 2 * multiplier),
            tmp: Array.from({ length: 10 }, (_, i) => 20 + i * 1 * multiplier),
            bat: Array.from({ length: 10 }, (_, i) => 100 - i * 2 * Math.abs(multiplier)),
            timestamps,
        },
        device002: {
            hum: Array.from({ length: 10 }, (_, i) => 45 + i * 2 * multiplier),
            tmp: Array.from({ length: 10 }, (_, i) => 22 + i * 1 * multiplier),
            bat: Array.from({ length: 10 }, (_, i) => 95 - i * 2 * Math.abs(multiplier)),
            timestamps,
        },
    };
};

/**
 * Helper to get device list from grouped data
 */
export const getDevicesFromGroupedData = (groupedData: GroupedData): string[] => {
    return Object.keys(groupedData);
};

/**
 * Helper to create extended mappings for large device sets
 */
export const createExtendedMappings = (deviceCount: number): Record<string, string> => {
    const devices = Array.from({ length: deviceCount }, (_, i) => `device${(i + 1).toString().padStart(3, '0')}`);
    return createMockMappings(devices);
};

/**
 * Helper to create extended color map for large device sets
 */
export const createExtendedColorMap = (deviceCount: number): Record<string, string> => {
    const devices = Array.from({ length: deviceCount }, (_, i) => `device${(i + 1).toString().padStart(3, '0')}`);
    return createMockColorMap(devices);
};
