import type { Meta, StoryObj } from '@storybook/react-vite';
import { TableComponent } from './TableComponent';
import {
    mockMappings,
    mockTableDataFull,
    mockTableDataWithNulls,
    mockTableDataSingleDevice,
    mockTableDataLarge,
    createExtremeValueData,
    createAllNullMetricData,
    createSporadicGapsData,
    createConsistentValueData,
    createMonotonicData,
    getDevicesFromGroupedData,
    createExtendedMappings,
} from '../test-utils';

const meta: Meta<typeof TableComponent> = {
    title: 'Chart Components/TableComponent',
    component: TableComponent,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        selectedMetric: {
            control: 'select',
            options: ['tmp', 'hum', 'bat'],
            description: 'The primary metric to display in split view',
        },
        splitView: {
            control: 'boolean',
            description: 'Toggle between split view (single metric) and combined view (multiple metrics)',
        },
        className: {
            control: 'text',
            description: 'Additional CSS classes',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Split View Stories - Single Metric Display

export const HumidityTable: Story = {
    args: {
        groupedData: mockTableDataFull,
        selectedDevices: getDevicesFromGroupedData(mockTableDataFull),
        selectedMetric: 'hum',
        mappings: mockMappings,
        splitView: true,
    },
};

export const TemperatureTable: Story = {
    args: {
        groupedData: mockTableDataFull,
        selectedDevices: getDevicesFromGroupedData(mockTableDataFull),
        selectedMetric: 'tmp',
        mappings: mockMappings,
        splitView: true,
    },
};

export const BatteryTable: Story = {
    args: {
        groupedData: mockTableDataFull,
        selectedDevices: getDevicesFromGroupedData(mockTableDataFull),
        selectedMetric: 'bat',
        mappings: mockMappings,
        splitView: true,
    },
};

// Combined View Stories - Multiple Metrics

export const CombinedViewAllMetrics: Story = {
    args: {
        groupedData: mockTableDataFull,
        selectedDevices: getDevicesFromGroupedData(mockTableDataFull),
        selectedMetric: 'tmp',
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: true,
        },
        mappings: mockMappings,
        splitView: false,
    },
};

export const CombinedViewTwoMetrics: Story = {
    args: {
        groupedData: mockTableDataFull,
        selectedDevices: getDevicesFromGroupedData(mockTableDataFull),
        selectedMetric: 'tmp',
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: false,
        },
        mappings: mockMappings,
        splitView: false,
    },
};

// Device Variations

export const SingleDevice: Story = {
    args: {
        groupedData: mockTableDataSingleDevice,
        selectedDevices: ['device001'],
        selectedMetric: 'hum',
        mappings: mockMappings,
        splitView: true,
    },
};

export const TwoDevices: Story = {
    args: {
        groupedData: mockTableDataFull,
        selectedDevices: ['device001', 'device002'],
        selectedMetric: 'tmp',
        mappings: mockMappings,
        splitView: true,
    },
};

export const ManyDevices: Story = {
    args: {
        groupedData: mockTableDataLarge,
        selectedDevices: getDevicesFromGroupedData(mockTableDataLarge),
        selectedMetric: 'hum',
        mappings: createExtendedMappings(5),
        splitView: true,
    },
};

// Data Edge Cases

export const WithMissingData: Story = {
    args: {
        groupedData: mockTableDataWithNulls,
        selectedDevices: getDevicesFromGroupedData(mockTableDataWithNulls),
        selectedMetric: 'hum',
        mappings: mockMappings,
        splitView: true,
    },
};

export const CombinedViewWithMissingData: Story = {
    args: {
        groupedData: mockTableDataWithNulls,
        selectedDevices: getDevicesFromGroupedData(mockTableDataWithNulls),
        selectedMetric: 'tmp',
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: true,
        },
        mappings: mockMappings,
        splitView: false,
    },
};

export const SporadicGaps: Story = {
    args: {
        groupedData: createSporadicGapsData(3),
        selectedDevices: ['device001', 'device002', 'device003'],
        selectedMetric: 'tmp',
        mappings: mockMappings,
        splitView: true,
    },
};

export const ExtremeValues: Story = {
    args: {
        groupedData: createExtremeValueData(2),
        selectedDevices: ['device001', 'device002'],
        selectedMetric: 'tmp',
        mappings: mockMappings,
        splitView: true,
    },
};

export const ConsistentValues: Story = {
    args: {
        groupedData: createConsistentValueData(),
        selectedDevices: ['device001', 'device002'],
        selectedMetric: 'hum',
        mappings: mockMappings,
        splitView: true,
    },
};

export const AscendingTrend: Story = {
    args: {
        groupedData: createMonotonicData('ascending'),
        selectedDevices: ['device001', 'device002'],
        selectedMetric: 'tmp',
        mappings: mockMappings,
        splitView: true,
    },
};

export const DescendingTrend: Story = {
    args: {
        groupedData: createMonotonicData('descending'),
        selectedDevices: ['device001', 'device002'],
        selectedMetric: 'tmp',
        mappings: mockMappings,
        splitView: true,
    },
};

export const AllNullHumidity: Story = {
    args: {
        groupedData: createAllNullMetricData('hum'),
        selectedDevices: ['device001', 'device002'],
        selectedMetric: 'hum',
        mappings: mockMappings,
        splitView: true,
    },
};

export const EmptyData: Story = {
    args: {
        groupedData: {},
        selectedDevices: [],
        selectedMetric: 'hum',
        mappings: {},
        splitView: true,
    },
};

export const NoMetricsSelected: Story = {
    args: {
        groupedData: mockTableDataFull,
        selectedDevices: getDevicesFromGroupedData(mockTableDataFull),
        selectedMetric: 'tmp',
        selectedMetrics: {
            hum: false,
            tmp: false,
            bat: false,
        },
        mappings: mockMappings,
        splitView: false,
    },
};

// Styling Variations

export const CustomClassName: Story = {
    args: {
        groupedData: mockTableDataFull,
        selectedDevices: getDevicesFromGroupedData(mockTableDataFull),
        selectedMetric: 'tmp',
        mappings: mockMappings,
        splitView: true,
        className: 'shadow-lg border-2 border-blue-500',
    },
};

export const WithoutMappings: Story = {
    args: {
        groupedData: mockTableDataFull,
        selectedDevices: getDevicesFromGroupedData(mockTableDataFull),
        selectedMetric: 'hum',
        mappings: {},
        splitView: true,
    },
};
