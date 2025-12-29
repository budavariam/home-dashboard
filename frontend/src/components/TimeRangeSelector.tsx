import React from 'react';
import { useTranslation } from 'react-i18next';
import { TimeRange } from '../types';

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
    const { t } = useTranslation();

    const TIME_RANGES = [
        { value: "1h", label: t('TIME_RANGE.LAST_1_HOUR') },
        { value: "6h", label: t('TIME_RANGE.LAST_6_HOURS') },
        { value: "12h", label: t('TIME_RANGE.LAST_12_HOURS') },
        { value: "24h", label: t('TIME_RANGE.LAST_24_HOURS') },
        { value: "48h", label: t('TIME_RANGE.LAST_2_DAYS') },
        { value: "1w", label: t('TIME_RANGE.LAST_WEEK') },
        { value: "2w", label: t('TIME_RANGE.PAST_2_WEEKS') },
        { value: "1m", label: t('TIME_RANGE.LAST_MONTH') },
    ] as const;

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