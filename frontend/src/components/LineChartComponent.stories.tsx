import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChartComponent } from './LineChartComponent';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { DeviceData } from '@/types';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const meta: Meta<typeof LineChartComponent> = {
    title: 'Chart Components/LineChartComponent',
    component: LineChartComponent,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

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

const mockLineChartData = generateMockData();
const mockColorMap = {
    'device001': '#3b82f6',
    'device002': '#f97316',
    'device003': '#10b981',
};
const mockMappings = {
    'device001': 'Living Room Sensor',
    'device002': 'Kitchen Sensor',
    'device003': 'Bedroom Sensor',
    'device004': 'Bathroom Sensor',
};

export const MultiMetricChart: Story = {
    args: {
        groupedData: mockLineChartData,
        selectedDevices: ['device001', 'device002', 'device003'],
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: false,
        },
        chartConfig: {
            showLegend: true,
            showAxisLabels: true,
            splitCharts: false,
        },
        mappings: mockMappings,
        colorMap: mockColorMap,
        className: 'h-96 p-4',
    },
};

export const SingleMetricChart: Story = {
    args: {
        groupedData: mockLineChartData,
        selectedDevices: ['device001', 'device002', 'device003'],
        selectedMetrics: {
            hum: true,
            tmp: false,
            bat: false,
        },
        chartConfig: {
            showLegend: true,
            showAxisLabels: true,
            splitCharts: false,
        },
        mappings: mockMappings,
        colorMap: mockColorMap,
        metricKey: 'hum',
        className: 'h-96 p-4',
    },
};

export const NoLegendOrLabels: Story = {
    args: {
        groupedData: mockLineChartData,
        selectedDevices: ['device001', 'device002'],
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: false,
        },
        chartConfig: {
            showLegend: false,
            showAxisLabels: false,
            splitCharts: false,
        },
        mappings: mockMappings,
        colorMap: mockColorMap,
        className: 'h-96 p-4',
    },
};

export const SingleDevice: Story = {
    args: {
        groupedData: mockLineChartData,
        selectedDevices: ['device001'],
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: true,
        },
        chartConfig: {
            showLegend: true,
            showAxisLabels: true,
            splitCharts: false,
        },
        mappings: mockMappings,
        colorMap: mockColorMap,
        className: 'h-96 p-4',
    },
};