import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeviceSelector } from './DeviceSelector';
import { useState } from 'react';

const meta: Meta<typeof DeviceSelector> = {
    title: 'Chart Components/DeviceSelector',
    component: DeviceSelector,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockDevices = ['device001', 'device002', 'device003', 'device004'];
const mockMappings = {
    'device001': 'Living Room Sensor',
    'device002': 'Kitchen Sensor',
    'device003': 'Bedroom Sensor',
    'device004': 'Bathroom Sensor',
};
const mockColorMap = {
    'device001': '#3b82f6',
    'device002': '#f97316',
    'device003': '#10b981',
    'device004': '#eab308',
};

export const AllDevicesSelected: Story = {
    render: (args) => {
        const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);
        return (
            <DeviceSelector
                {...args}
                selectedDevices={selectedDevices}
                onChange={setSelectedDevices}
            />
        );
    },
    args: {
        devices: mockDevices,
        selectedDevices: mockDevices,
        mappings: mockMappings,
        colorMap: mockColorMap,
    },
};

export const PartialSelection: Story = {
    render: (args) => {
        const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);
        return (
            <DeviceSelector
                {...args}
                selectedDevices={selectedDevices}
                onChange={setSelectedDevices}
            />
        );
    },
    args: {
        devices: mockDevices,
        selectedDevices: ['device001', 'device003'],
        mappings: mockMappings,
        colorMap: mockColorMap,
    },
};

export const NoMappings: Story = {
    render: (args) => {
        const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);
        return (
            <DeviceSelector
                {...args}
                selectedDevices={selectedDevices}
                onChange={setSelectedDevices}
            />
        );
    },
    args: {
        devices: mockDevices,
        selectedDevices: ['device001', 'device002'],
        mappings: {},
        colorMap: mockColorMap,
    },
};