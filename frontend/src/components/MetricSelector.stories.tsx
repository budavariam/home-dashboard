import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricSelector } from './MetricSelector';
import { useState } from 'react';

const meta: Meta<typeof MetricSelector> = {
    title: 'Chart Components/MetricSelector',
    component: MetricSelector,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSelected: Story = {
    render: (args) => {
        const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
        return (
            <MetricSelector
                {...args}
                selectedMetrics={selectedMetrics}
                onChange={setSelectedMetrics}
            />
        );
    },
    args: {
        selectedMetrics: {
            hum: true,
            tmp: true,
            bat: true,
        },
    },
};

export const PartiallySelected: Story = {
    render: (args) => {
        const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
        return (
            <MetricSelector
                {...args}
                selectedMetrics={selectedMetrics}
                onChange={setSelectedMetrics}
            />
        );
    },
    args: {
        selectedMetrics: {
            hum: true,
            tmp: false,
            bat: true,
        },
    },
};

export const NoneSelected: Story = {
    render: (args) => {
        const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
        return (
            <MetricSelector
                {...args}
                selectedMetrics={selectedMetrics}
                onChange={setSelectedMetrics}
            />
        );
    },
    args: {
        selectedMetrics: {
            hum: false,
            tmp: false,
            bat: false,
        },
    },
};