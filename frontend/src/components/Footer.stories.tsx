import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
    title: 'Layout/Footer',
    component: Footer,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LightMode: Story = {
    parameters: {
        backgrounds: {
            default: 'light',
        },
    },
};

export const DarkMode: Story = {
    parameters: {
        backgrounds: {
            default: 'dark',
        },
    },
    decorators: [
        (Story) => (
            <div className="dark">
                <Story />
            </div>
        ),
    ],
};

export const InContext: Story = {
    decorators: [
        (Story) => (
            <div className="min-h-screen flex flex-col">
                <div className="flex-1 p-8 bg-white dark:bg-gray-900">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Page Content
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">
                        This shows how the footer looks at the bottom of a page.
                    </p>
                </div>
                <Story />
            </div>
        ),
    ],
};
