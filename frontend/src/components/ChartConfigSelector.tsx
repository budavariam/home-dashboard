import React from 'react';
import { ChartConfig } from '../types';

interface ChartConfigSelectorProps {
    config: ChartConfig;
    onChange: (config: ChartConfig) => void;
    className?: string;
}

export const ChartConfigSelector: React.FC<ChartConfigSelectorProps> = ({
    config,
    onChange,
    className = ""
}) => {
    const options = {
        showLegend: "Legends",
        showAxisLabels: "Axis Labels",
        splitCharts: "Split Charts",
    };

    return (
        <div className={`flex gap-2 items-center ${className}`}>
            {Object.entries(options).map(([key, label]) => (
                <label key={key} className="text-gray-700 dark:text-gray-300">
                    <input
                        type="checkbox"
                        className="mr-2"
                        checked={config[key as keyof ChartConfig]}
                        onChange={(e) => onChange({
                            ...config,
                            [key]: e.target.checked,
                        })}
                    />
                    {label}
                </label>
            ))}
        </div>
    );
};