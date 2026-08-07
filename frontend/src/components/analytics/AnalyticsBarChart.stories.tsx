import type { Meta, StoryObj } from '@storybook/react-vite'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { AnalyticsBarChart } from './AnalyticsBarChart'
import { clearAnalyticsData, storeAnalyticsEntries } from '../../lib/analyticsDb'

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, LineElement, PointElement, Title, Tooltip, Legend)

const SENSORS = ['ATC_0', 'ATC_1', 'ATC_2', 'ATC_3']

function makeSyntheticEntries(year: number) {
    const entries = []
    for (let month = 1; month <= 12; month++) {
        const daysInMonth = new Date(year, month, 0).getDate()
        for (let day = 1; day <= daysInMonth; day++) {
            for (const sensor of SENSORS) {
                // Simulate realistic seasonal temperatures
                const seasonal = 10 + 12 * Math.sin((month - 3) * Math.PI / 6)
                const daily = (Math.random() - 0.5) * 3
                const tmp = parseFloat((seasonal + daily).toFixed(2))
                const ts = Date.UTC(year, month - 1, day, 12, 0, 0)
                entries.push({ ts, year, month, day, sensorName: sensor, tmp })
            }
        }
    }
    return entries
}

const meta: Meta<typeof AnalyticsBarChart> = {
    title: 'Analytics/AnalyticsBarChart',
    component: AnalyticsBarChart,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const NoYearsSelected: Story = {
    args: {
        yearA: null,
        yearB: null,
        selectedSensors: [],
    },
}

export const TwoYearComparison: Story = {
    loaders: [
        async () => {
            await clearAnalyticsData()
            await storeAnalyticsEntries(makeSyntheticEntries(2025))
            await storeAnalyticsEntries(makeSyntheticEntries(2026))
            return {}
        },
    ],
    args: {
        yearA: 2025,
        yearB: 2026,
        selectedSensors: SENSORS,
    },
}

export const SingleYearOnly: Story = {
    loaders: [
        async () => {
            await clearAnalyticsData()
            await storeAnalyticsEntries(makeSyntheticEntries(2025))
            return {}
        },
    ],
    args: {
        yearA: 2025,
        yearB: null,
        selectedSensors: SENSORS,
    },
}
