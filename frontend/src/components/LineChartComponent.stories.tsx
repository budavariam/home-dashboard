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
import { mockColorMap, mockLineChartData, mockMappings } from '../test-utils';


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


export const MultiMetricChart: Story = {
    args: {
        groupedData: mockLineChartData,
        selectedDevices: ['device001', 'device002', 'device003'],
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: false,
        },
        lineChartConfig: {
            showLegend: true,
            showAxisLabels: true,
            autoScaleY: false,
            extrapolation: {
                enabled: false,
                method: 'linear',
                points: 5,
                windowSize: 10,
            },
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
        lineChartConfig: {
            showLegend: true,
            showAxisLabels: true,
            autoScaleY: false,
            extrapolation: {
                enabled: false,
                method: 'linear',
                points: 5,
                windowSize: 10,
            },
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
        lineChartConfig: {
            showLegend: false,
            showAxisLabels: false,
            autoScaleY: false,
            extrapolation: {
                enabled: false,
                method: 'linear',
                points: 5,
                windowSize: 10,
            },
        },
        mappings: mockMappings,
        colorMap: mockColorMap,
        className: 'h-96 p-4',
    },
};


// Example of uncontrolled mode (no lineChartConfig prop)
export const UncontrolledMode: Story = {
    args: {
        groupedData: mockLineChartData,
        selectedDevices: ['device001'],
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: true,
        },
        mappings: mockMappings,
        colorMap: mockColorMap,
        className: 'h-96 p-4',
    },
};


// Extrapolation Stories
export const WithLinearForecast: Story = {
    args: {
        groupedData: mockLineChartData,
        selectedDevices: ['device001', 'device002'],
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: false,
        },
        lineChartConfig: {
            showLegend: true,
            showAxisLabels: true,
            autoScaleY: false,
            extrapolation: {
                enabled: true,
                method: 'linear',
                points: 5,
                windowSize: 10,
            },
        },
        mappings: mockMappings,
        colorMap: mockColorMap,
        className: 'h-96 p-4',
    },
};


export const WithExponentialForecast: Story = {
    args: {
        groupedData: mockLineChartData,
        selectedDevices: ['device001', 'device002'],
        selectedMetrics: {
            hum: true,
            tmp: false,
            bat: false,
        },
        lineChartConfig: {
            showLegend: true,
            showAxisLabels: true,
            autoScaleY: false,
            extrapolation: {
                enabled: true,
                method: 'exponential',
                points: 8,
                windowSize: 15,
            },
        },
        mappings: mockMappings,
        colorMap: mockColorMap,
        metricKey: 'hum',
        className: 'h-96 p-4',
    },
};


export const WithMovingAverageForecast: Story = {
    args: {
        groupedData: mockLineChartData,
        selectedDevices: ['device001', 'device002', 'device003'],
        selectedMetrics: {
            hum: false,
            tmp: true,
            bat: false,
        },
        lineChartConfig: {
            showLegend: true,
            showAxisLabels: true,
            autoScaleY: true,
            extrapolation: {
                enabled: true,
                method: 'moving-average',
                points: 10,
                windowSize: 20,
            },
        },
        mappings: mockMappings,
        colorMap: mockColorMap,
        metricKey: 'tmp',
        className: 'h-96 p-4',
    },
};
