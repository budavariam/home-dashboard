import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeatmapComponent } from './HeatmapComponent';
import { DeviceData, GroupedData } from '@/types';
import { mockMappings } from '../test-utils';
import { augmentWithMissingEntries } from '../utils/missingEntries';

const meta: Meta<typeof HeatmapComponent> = {
    title: 'Chart Components/HeatmapComponent',
    component: HeatmapComponent,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Generate mock data
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

const mockGroupedData = generateMockData();

export const HumidityHeatmap: Story = {
    args: {
        groupedData: mockGroupedData,
        selectedDevices: ['device001', 'device002', 'device003'],
        selectedMetric: 'hum',
        mappings: mockMappings,
    },
};

export const TemperatureHeatmap: Story = {
    args: {
        groupedData: mockGroupedData,
        selectedDevices: ['device001', 'device002', 'device003'],
        selectedMetric: 'tmp',
        mappings: mockMappings,
    },
};

export const BatteryHeatmap: Story = {
    args: {
        groupedData: mockGroupedData,
        selectedDevices: ['device001', 'device002', 'device003'],
        selectedMetric: 'bat',
        mappings: mockMappings,
    },
};

export const SingleDevice: Story = {
    args: {
        groupedData: mockGroupedData,
        selectedDevices: ['device001'],
        selectedMetric: 'hum',
        mappings: mockMappings,
    },
};

export const WithMissingData: Story = {
    args: {
        groupedData: {
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
        },
        selectedDevices: ['device001', 'device002'],
        selectedMetric: 'hum',
        mappings: mockMappings,
    },
};

export const EmptyData: Story = {
    args: {
        groupedData: {},
        selectedDevices: [],
        selectedMetric: 'hum',
        mappings: {},
    },
};

const createHeatmapDataWithGaps = (): GroupedData => {
    const timestamps = [
        '01.04 08:00', '01.04 08:30', '01.04 09:00', '01.04 09:30', '01.04 10:00', '01.04 10:30',
        '01.04 13:00', '01.04 13:30', '01.04 14:00', '01.04 14:30', '01.04 15:00', '01.04 15:30',
    ];
    const devices = ['device001', 'device002', 'device003'];
    const data: GroupedData = {};
    devices.forEach(device => {
        data[device] = {
            hum: timestamps.map((_, i) => 45 + Math.sin(i * 0.5) * 15),
            tmp: timestamps.map((_, i) => 22 + Math.cos(i * 0.3) * 5),
            bat: timestamps.map((_, i) => 90 - i * 0.5),
            timestamps,
        };
    });
    return data;
};

const _heatmapGappedResult = augmentWithMissingEntries(createHeatmapDataWithGaps());

export const WithMissingEntriesDetected: Story = {
    args: {
        groupedData: _heatmapGappedResult.data,
        selectedDevices: ['device001', 'device002', 'device003'],
        selectedMetric: 'hum',
        mappings: mockMappings,
        missingIndices: _heatmapGappedResult.missingIndices,
    },
};