import React, { useMemo, useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { MetricKey, GroupedData } from '../types';


const METRICS = [
    { key: "hum" as MetricKey, label: "Humidity" },
    { key: "tmp" as MetricKey, label: "Temperature", borderDash: [5, 5] },
    { key: "bat" as MetricKey, label: "Battery", borderDash: [2, 2] },
];


export interface LineChartConfig {
    showLegend: boolean;
    showAxisLabels: boolean;
    autoScaleY: boolean;
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
    // Internal state for uncontrolled mode
    const [internalConfig, setInternalConfig] = useState<LineChartConfig>(defaultLineChartConfig);

    // Use external config if provided, otherwise use internal
    const isControlled = externalConfig !== undefined;
    const config = isControlled ? externalConfig : internalConfig;

    // Sync internal state with external config when it changes
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

    const createDatasets = (targetMetricKey: MetricKey) => {
        const metric = METRICS.find(m => m.key === targetMetricKey)!;
        return Object.entries(groupedData)
            .filter(([device]) => selectedDevices.includes(device))
            .map(([device, data]) => ({
                label: `${mappings[device] || device} - ${metric.label}`,
                data: data[targetMetricKey],
                borderColor: colorMap[device],
                backgroundColor: `${colorMap[device]}80`,
                tension: 0.4,
                borderDash: metric.borderDash,
                spanGaps: true,
                pointRadius: 2,
                pointHoverRadius: 4,
            }));
    };

    const datasets = metricKey
        ? createDatasets(metricKey)
        : METRICS.filter(m => selectedMetrics[m.key]).flatMap(m => createDatasets(m.key));

    // Calculate Y-axis range if auto-scale is enabled
    const yAxisConfig = useMemo(() => {
        if (!config.autoScaleY) {
            return { beginAtZero: true };
        }

        // Collect all data points
        const allValues = datasets.flatMap(ds =>
            ds.data.filter((v): v is number => v !== null && typeof v === 'number')
        );

        if (allValues.length === 0) {
            return { beginAtZero: true };
        }

        const minVal = Math.min(...allValues);
        const maxVal = Math.max(...allValues);
        const padding = (maxVal - minVal) * 0.1; // 10% padding

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
                    ? `${METRICS.find(m => m.key === metricKey)?.label} Chart`
                    : "Historical Device Readings",
                color: "#9CA3AF",
            },
        },
        scales: {
            x: {
                ticks: {
                    display: config.showAxisLabels,
                    color: "#9CA3AF",
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: true,
                    maxTicksLimit: 15,
                },
                grid: { color: "#4B5563" },
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
                    labels: Object.values(groupedData)[0]?.timestamps || [],
                    datasets,
                }}
            />

            {/* Line Chart Controls - Aligned Right */}
            <div className="flex gap-2 justify-end mt-2 flex-wrap">
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
        </div>
    );
};
