import React, { useMemo } from 'react';
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { MetricKey, GroupedData } from '../types';


const METRICS = [
    { key: "hum" as MetricKey, label: "Humidity" },
    { key: "tmp" as MetricKey, label: "Temperature", borderDash: [5, 5] },
    { key: "bat" as MetricKey, label: "Battery", borderDash: [2, 2] },
];


interface LineChartConfig {
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
}


export const LineChartComponent: React.FC<LineChartComponentProps> = ({
    groupedData,
    selectedDevices,
    selectedMetrics,
    mappings,
    colorMap,
    metricKey,
    className = ""
}) => {
    const [lineChartConfig, setLineChartConfig] = React.useState<LineChartConfig>({
        showLegend: true,
        showAxisLabels: true,
        autoScaleY: false,
    });


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
        if (!lineChartConfig.autoScaleY) {
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
    }, [datasets, lineChartConfig.autoScaleY]);


    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: lineChartConfig.showLegend,
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
                    display: lineChartConfig.showAxisLabels,
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
                    display: lineChartConfig.showAxisLabels,
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
                        checked={lineChartConfig.showLegend}
                        onChange={(e) => setLineChartConfig(prev => ({
                            ...prev,
                            showLegend: e.target.checked
                        }))}
                    />
                    Legend
                </label>
                <label className="text-gray-700 dark:text-gray-300 text-xs flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="mr-1"
                        checked={lineChartConfig.showAxisLabels}
                        onChange={(e) => setLineChartConfig(prev => ({
                            ...prev,
                            showAxisLabels: e.target.checked
                        }))}
                    />
                    Axis
                </label>
                <label className="text-gray-700 dark:text-gray-300 text-xs flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="mr-1"
                        checked={lineChartConfig.autoScaleY}
                        onChange={(e) => setLineChartConfig(prev => ({
                            ...prev,
                            autoScaleY: e.target.checked
                        }))}
                    />
                    Auto-scale
                </label>
            </div>
        </div>
    );
};
