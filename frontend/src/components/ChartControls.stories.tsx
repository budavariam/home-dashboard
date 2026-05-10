import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartControls } from './ChartControls';
import { useState } from 'react';
import { mockColorMap, mockDevices, mockMappings } from '../test-utils';

const meta: Meta<typeof ChartControls> = {
    title: 'Chart Components/ChartControls',
    component: ChartControls,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => {
        const [timeRange, setTimeRange] = useState(args.timeRange);
        const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
        const [chartConfig, setChartConfig] = useState(args.chartConfig);
        const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);

        return (
            <ChartControls
                {...args}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                selectedMetrics={selectedMetrics}
                onMetricsChange={setSelectedMetrics}
                chartConfig={chartConfig}
                onChartConfigChange={setChartConfig}
                selectedDevices={selectedDevices}
                onDevicesChange={setSelectedDevices}
            />
        );
    },
    args: {
        timeRange: '6h',
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: false,
        },
        chartConfig: {
            showLegend: true,
            showAxisLabels: true,
            splitCharts: true,
        },
        devices: mockDevices,
        selectedDevices: mockDevices.slice(0, 2),
        mappings: mockMappings,
        colorMap: mockColorMap,
    },
};

export const MobileView: Story = {
    render: (args) => {
        const [timeRange, setTimeRange] = useState(args.timeRange);
        const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
        const [chartConfig, setChartConfig] = useState(args.chartConfig);
        const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);

        return (
            <div className="max-w-sm">
                <ChartControls
                    {...args}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    selectedMetrics={selectedMetrics}
                    onMetricsChange={setSelectedMetrics}
                    chartConfig={chartConfig}
                    onChartConfigChange={setChartConfig}
                    selectedDevices={selectedDevices}
                    onDevicesChange={setSelectedDevices}
                />
            </div>
        );
    },
    args: {
        timeRange: '24h',
        selectedMetrics: {
            hum: true,
            tmp: false,
            bat: true,
        },
        chartConfig: {
            showLegend: false,
            showAxisLabels: true,
            splitCharts: false,
            enableExtrapolation: true,
            forecastMethod: 'linear',
            forecastPoints: 5,
            forecastWindowSize: 10,
            enableLimit: true,
            itemsPerHour: 4,
        },
        devices: mockDevices,
        selectedDevices: [mockDevices[0]],
        mappings: mockMappings,
        colorMap: mockColorMap,
    },
};

export const MobileOverflowStress: Story = {
    render: (args) => {
        const [timeRange, setTimeRange] = useState(args.timeRange);
        const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
        const [chartConfig, setChartConfig] = useState(args.chartConfig);
        const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);

        return (
            <div className="max-w-[320px] border p-2">
                <ChartControls
                    {...args}
                    timeRange={timeRange}
                    onTimeRangeChange={setTimeRange}
                    selectedMetrics={selectedMetrics}
                    onMetricsChange={setSelectedMetrics}
                    chartConfig={chartConfig}
                    onChartConfigChange={setChartConfig}
                    selectedDevices={selectedDevices}
                    onDevicesChange={setSelectedDevices}
                />
            </div>
        );
    },
    args: {
        timeRange: '6h',
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: true,
        },
        chartConfig: {
            showLegend: true,
            showAxisLabels: true,
            splitCharts: true,
            enableExtrapolation: true,
            forecastMethod: 'moving-average',
            forecastPoints: 20,
            forecastWindowSize: 50,
            enableLimit: true,
            itemsPerHour: 0.1,
            compareLastPeriod: true,
            autoScaleY: true,
        },
        devices: mockDevices,
        selectedDevices: mockDevices,
        mappings: mockMappings,
        colorMap: mockColorMap,
    },
};
