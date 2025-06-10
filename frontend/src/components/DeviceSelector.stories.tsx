import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeviceSelector } from './DeviceSelector';
import { useState } from 'react';
import { mockColorMap, mockDevices, mockMappings } from '../test-utils';

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