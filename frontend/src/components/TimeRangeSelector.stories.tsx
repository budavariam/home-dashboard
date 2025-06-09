import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeRangeSelector } from './TimeRangeSelector';
import { useState } from 'react';

const meta: Meta<typeof TimeRangeSelector> = {
    title: 'Chart Components/TimeRangeSelector',
    component: TimeRangeSelector,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value);
        return (
            <TimeRangeSelector
                {...args}
                value={value}
                onChange={setValue}
            />
        );
    },
    args: {
        value: '6h',
    },
};

export const WithCustomClass: Story = {
    render: (args) => {
        const [value, setValue] = useState(args.value);
        return (
            <TimeRangeSelector
                {...args}
                value={value}
                onChange={setValue}
            />
        );
    },
    args: {
        value: '24h',
        className: 'w-48',
    },
};