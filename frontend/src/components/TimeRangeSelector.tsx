import React from 'react';
import { TimeRange } from '../types';

const TIME_RANGES = [
    { value: "1h", label: "Last 1 Hour" },
    { value: "6h", label: "Last 6 Hours" },
    { value: "12h", label: "Last 12 Hours" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "48h", label: "Last 2 Days" },
    { value: "1w", label: "Last Week" },
    { value: "2w", label: "Past 2 Weeks" },
    { value: "1m", label: "Last Month" },
] as const;

interface TimeRangeSelectorProps {
    value: TimeRange;
    onChange: (timeRange: TimeRange) => void;
    className?: string;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
    value,
    onChange,
    className = ""
}) => {
    return (
        <select
            className={`border rounded p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 ${className}`}
            value={value}
            onChange={(e) => onChange(e.target.value as TimeRange)}
        >
            {TIME_RANGES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    );
};