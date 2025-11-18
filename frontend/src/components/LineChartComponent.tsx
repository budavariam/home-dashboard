import React, { useMemo, useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import { ChartOptions, ScriptableContext, ScriptableLineSegmentContext } from "chart.js";
import { MetricKey, GroupedData } from '../types';
import { extrapolateGroupedData, ExtrapolationConfig } from '../utils/extrapolation';

const METRICS = [
    { key: "hum" as MetricKey, label: "Humidity" },
    { key: "tmp" as MetricKey, label: "Temperature", borderDash: [5, 5] },
    { key: "bat" as MetricKey, label: "Battery", borderDash: [2, 2] },
];

export interface LineChartConfig {
    showLegend: boolean;
    showAxisLabels: boolean;
    autoScaleY: boolean;
    extrapolation: ExtrapolationConfig;
}

interface LineChartComponentProps {
    groupedData: GroupedData;
    selectedDevices: string[];
    selectedMetrics: Record<MetricKey, boolean>;
    mappings: Record<string, string>;
    colorMap: Record<string, string>;
    metricKey?: MetricKey;
    className?: string;
    lineChartConfig?: LineChartConfig;
    onLineChartConfigChange?: (config: LineChartConfig) => void;
}

const defaultLineChartConfig: LineChartConfig = {
    showLegend: true,
    showAxisLabels: true,
    autoScaleY: false,
    extrapolation: {
        enabled: false,
        method: 'linear',
        points: 5,
        windowSize: 10,
    },
};

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
    groupedData,
    selectedDevices,
    selectedMetrics,
    mappings,
    colorMap,
    metricKey,
    className = "",
    lineChartConfig: externalConfig,
    onLineChartConfigChange,
}) => {
    const [internalConfig, setInternalConfig] = useState<LineChartConfig>(defaultLineChartConfig);

    const isControlled = externalConfig !== undefined;
    const config = isControlled ? externalConfig : internalConfig;

    useEffect(() => {
        if (externalConfig) {
            setInternalConfig(externalConfig);
        }
    }, [externalConfig]);

    const handleConfigChange = (newConfig: LineChartConfig) => {
        if (onLineChartConfigChange) {
            onLineChartConfigChange(newConfig);
        }
        if (!isControlled) {
            setInternalConfig(newConfig);
        }
    };

    // Apply extrapolation if enabled
    const processedData = useMemo(() => {
        return extrapolateGroupedData(groupedData, config.extrapolation);
    }, [groupedData, config.extrapolation]);

    const originalLength = Object.values(groupedData)[0]?.timestamps.length || 0;
    const totalLength = Object.values(processedData)[0]?.timestamps.length || 0;

    const createDatasets = (targetMetricKey: MetricKey) => {
        const metric = METRICS.find(m => m.key === targetMetricKey)!;

        return Object.entries(processedData)
            .filter(([device]) => selectedDevices.includes(device))
            .map(([device, data]) => ({
                label: `${mappings[device] || device} - ${metric.label}`,
                data: data[targetMetricKey],
                borderColor: colorMap[device],
                backgroundColor: `${colorMap[device]}80`,
                tension: 0.4,
                borderDash: metric.borderDash,
                spanGaps: true,
                // Use scriptable options to style points based on whether they're extrapolated
                pointRadius: (context: ScriptableContext<'line'>) => {
                    const index = context.dataIndex;
                    return index >= originalLength ? 3 : 2;
                },
                pointHoverRadius: (context: ScriptableContext<'line'>) => {
                    const index = context.dataIndex;
                    return index >= originalLength ? 5 : 4;
                },
                pointStyle: () => {
                    return 'circle' as const;
                },
                pointBackgroundColor: (context: ScriptableContext<'line'>) => {
                    const index = context.dataIndex;
                    return index >= originalLength ? 'transparent' : colorMap[device];
                },
                pointBorderColor: (context: ScriptableContext<'line'>) => {
                    const index = context.dataIndex;
                    return index >= originalLength ? `${colorMap[device]}80` : colorMap[device];
                },
                pointBorderWidth: (context: ScriptableContext<'line'>) => {
                    const index = context.dataIndex;
                    return index >= originalLength ? 2 : 1;
                },
                // Style line segments differently for extrapolated portion
                segment: {
                    borderColor: (context: ScriptableLineSegmentContext) => {
                        const index = context.p0DataIndex;
                        return index >= originalLength - 1 ? `${colorMap[device]}80` : undefined;
                    },
                    borderDash: (context: ScriptableLineSegmentContext) => {
                        const index = context.p0DataIndex;
                        return index >= originalLength - 1 ? [10, 5] : metric.borderDash;
                    },
                },
            }));
    };


    const datasets = metricKey
        ? createDatasets(metricKey)
        : METRICS.filter(m => selectedMetrics[m.key]).flatMap(m => createDatasets(m.key));

    const yAxisConfig = useMemo(() => {
        if (!config.autoScaleY) {
            return { beginAtZero: true };
        }

        const allValues = datasets.flatMap(ds =>
            (Array.isArray(ds.data) ? ds.data : []).filter((v): v is number => v !== null && typeof v === 'number')
        );

        if (allValues.length === 0) {
            return { beginAtZero: true };
        }

        const minVal = Math.min(...allValues);
        const maxVal = Math.max(...allValues);
        const padding = (maxVal - minVal) * 0.1;

        return {
            min: Math.floor(minVal - padding),
            max: Math.ceil(maxVal + padding),
        };
    }, [datasets, config.autoScaleY]);

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: config.showLegend,
                position: "bottom",
                labels: { color: "#9CA3AF" },
            },
            title: {
                display: true,
                text: metricKey
                    ? `${METRICS.find(m => m.key === metricKey)?.label} Chart${config.extrapolation.enabled ? ' with Forecast' : ''}`
                    : "Historical Device Readings",
                color: "#9CA3AF",
            },
            tooltip: {
                callbacks: {
                    title: (context) => {
                        const index = context[0].dataIndex;
                        const label = context[0].label;
                        return index >= originalLength ? `${label} (Forecast)` : label;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    display: config.showAxisLabels,
                    color: (context) => {
                        const index = context.index;
                        return index >= originalLength ? "#60A5FA" : "#9CA3AF";
                    },
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: true,
                    maxTicksLimit: 15,
                },
                grid: {
                    color: (context) => {
                        const index = context.index;
                        return index === originalLength ? "#3B82F6" : "#4B5563";
                    },
                    lineWidth: (context) => {
                        const index = context.index;
                        return index === originalLength ? 2 : 1;
                    },
                },
            },
            y: {
                ticks: {
                    display: config.showAxisLabels,
                    color: "#9CA3AF",
                },
                grid: { color: "#4B5563" },
                ...yAxisConfig,
            },
        },
    };

    return (
        <div className={`${className} mb-6`}>
            <Line
                options={chartOptions}
                data={{
                    labels: Object.values(processedData)[0]?.timestamps || [],
                    datasets,
                }}
            />

            <div className="flex gap-4 justify-end mt-2 flex-wrap items-center">
                <div className="flex gap-2">
                    <label className="text-gray-700 dark:text-gray-300 text-xs flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="mr-1"
                            checked={config.showLegend}
                            onChange={(e) => handleConfigChange({
                                ...config,
                                showLegend: e.target.checked
                            })}
                        />
                        Legend
                    </label>
                    <label className="text-gray-700 dark:text-gray-300 text-xs flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="mr-1"
                            checked={config.showAxisLabels}
                            onChange={(e) => handleConfigChange({
                                ...config,
                                showAxisLabels: e.target.checked
                            })}
                        />
                        Axis
                    </label>
                    <label className="text-gray-700 dark:text-gray-300 text-xs flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="mr-1"
                            checked={config.autoScaleY}
                            onChange={(e) => handleConfigChange({
                                ...config,
                                autoScaleY: e.target.checked
                            })}
                        />
                        Auto-scale
                    </label>
                </div>

                {config.extrapolation.enabled && totalLength > originalLength && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 italic border-l pl-4 border-gray-300 dark:border-gray-600">
                        Showing {originalLength} actual + {totalLength - originalLength} forecast points
                    </div>
                )}
            </div>
        </div>
    );
};
