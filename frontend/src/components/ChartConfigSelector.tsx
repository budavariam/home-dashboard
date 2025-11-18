import React from 'react';
import { ChartConfig } from '../types';

interface ChartConfigSelectorProps {
    config: ChartConfig;
    onChange: (config: ChartConfig) => void;
    className?: string;
    viewMode?: 'line' | 'heatmap' | 'table';
}

export const ChartConfigSelector: React.FC<ChartConfigSelectorProps> = ({
    config,
    onChange,
    className = "",
    viewMode = 'line'
}) => {
    const showExtrapolation = viewMode === 'line' || viewMode === 'table';

    return (
        <div className={`flex flex-row gap-2 ${className}`}>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                    type="checkbox"
                    checked={config.splitCharts}
                    onChange={(e) => onChange({
                        ...config,
                        splitCharts: e.target.checked,
                    })}
                />
                Split Charts
            </label>

            {showExtrapolation && (
                <div className="flex relative">
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.enableExtrapolation || false}
                            onChange={(e) => onChange({
                                ...config,
                                enableExtrapolation: e.target.checked,
                            })}
                        />
                        Enable Forecast
                    </label>

                    {config.enableExtrapolation && (
                        <details className="absolute top-full left-0 mt-1 z-50 group">
                            <summary className="cursor-pointer list-none">
                                <div className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                                    <span>Options</span>
                                    <span className="group-open:rotate-180 transition-transform">▼</span>
                                </div>
                            </summary>
                            <div className="mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg min-w-[280px] sm:min-w-[320px]">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <label className="text-sm text-gray-700 dark:text-gray-300 min-w-[100px] font-medium">
                                            Method:
                                        </label>
                                        <select
                                            className="text-sm border rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex-1"
                                            value={config.forecastMethod || 'linear'}
                                            onChange={(e) => onChange({
                                                ...config,
                                                forecastMethod: e.target.value as 'linear' | 'exponential' | 'moving-average',
                                            })}
                                        >
                                            <option value="linear">Linear</option>
                                            <option value="exponential">Exponential</option>
                                            <option value="moving-average">Moving Average</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <label className="text-sm text-gray-700 dark:text-gray-300 min-w-[100px] font-medium">
                                            Points:
                                        </label>
                                        <input
                                            type="number"
                                            className="text-sm border rounded px-2 py-1 w-full sm:w-24 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                            value={config.forecastPoints || 5}
                                            min="1"
                                            max="20"
                                            onChange={(e) => onChange({
                                                ...config,
                                                forecastPoints: parseInt(e.target.value) || 5,
                                            })}
                                            title="Number of points to forecast"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <label className="text-sm text-gray-700 dark:text-gray-300 min-w-[100px] font-medium">
                                            Window Size:
                                        </label>
                                        <input
                                            type="number"
                                            className="text-sm border rounded px-2 py-1 w-full sm:w-24 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                            value={config.forecastWindowSize || 10}
                                            min="1"
                                            max="50"
                                            onChange={(e) => onChange({
                                                ...config,
                                                forecastWindowSize: parseInt(e.target.value) || 10,
                                            })}
                                            title="Number of historical points to use for forecasting"
                                        />
                                    </div>
                                </div>
                            </div>
                        </details>
                    )}
                </div>
            )}
        </div>
    );
};
