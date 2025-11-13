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
    return (
        <div className={`flex gap-2 items-center ${className}`}>
            <label className="text-gray-700 dark:text-gray-300">
                <input
                    type="checkbox"
                    className="mr-2"
                    checked={config.splitCharts}
                    onChange={(e) => onChange({
                        ...config,
                        splitCharts: e.target.checked,
                    })}
                />
                Split Charts
            </label>
        </div>
    );
};
