import React from 'react';
import { useTranslation } from 'react-i18next';
import { MetricKey, MetricConfig } from '../types';

interface MetricSelectorProps {
    selectedMetrics: Record<MetricKey, boolean>;
    onChange: (metrics: Record<MetricKey, boolean>) => void;
    className?: string;
}

export const MetricSelector: React.FC<MetricSelectorProps> = ({
    selectedMetrics,
    onChange,
    className = ""
}) => {
    const { t } = useTranslation();

    const METRICS: MetricConfig[] = [
        { key: "hum", label: t('METRICS.HUMIDITY') },
        { key: "tmp", label: t('METRICS.TEMPERATURE'), borderDash: [5, 5] },
        { key: "bat", label: t('METRICS.BATTERY'), borderDash: [2, 2] },
    ];

    return (
        <div className={`flex gap-2 items-center ${className}`}>
            {METRICS.map(({ key, label }) => (
                <label key={key} className="text-gray-700 dark:text-gray-300">
                    <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedMetrics[key]}
                        onChange={(e) => onChange({
                            ...selectedMetrics,
                            [key]: e.target.checked,
                        })}
                    />
                    {label}
                </label>
            ))}
        </div>
    );
};