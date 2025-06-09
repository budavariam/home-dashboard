import React from 'react';
import { MetricKey, MetricConfig } from '../types';

const METRICS: MetricConfig[] = [
    { key: "hum", label: "Humidity" },
    { key: "tmp", label: "Temperature", borderDash: [5, 5] },
    { key: "bat", label: "Battery", borderDash: [2, 2] },
];

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