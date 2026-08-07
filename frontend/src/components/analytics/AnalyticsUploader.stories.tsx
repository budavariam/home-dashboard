import type { Meta, StoryObj } from '@storybook/react-vite'
import { AnalyticsUploader } from './AnalyticsUploader'

const meta: Meta<typeof AnalyticsUploader> = {
    title: 'Analytics/AnalyticsUploader',
    component: AnalyticsUploader,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
    args: {
        onUpload: async () => {},
        onClear: () => {},
    },
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
    args: {
        entryCount: 0,
        isLoading: false,
    },
}

export const DataLoaded: Story = {
    args: {
        entryCount: 52480,
        isLoading: false,
    },
}

export const Processing: Story = {
    args: {
        entryCount: 0,
        isLoading: true,
    },
}

export const ProcessingWithExistingData: Story = {
    args: {
        entryCount: 52480,
        isLoading: true,
    },
}
