import React from 'react';
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { MetricKey, GroupedData, ChartConfig } from '../types';

const METRICS = [
    { key: "hum" as MetricKey, label: "Humidity" },
    { key: "tmp" as MetricKey, label: "Temperature", borderDash: [5, 5] },
    { key: "bat" as MetricKey, label: "Battery", borderDash: [2, 2] },
];

interface LineChartComponentProps {
    groupedData: GroupedData;
    selectedDevices: string[];
    selectedMetrics: Record<MetricKey, boolean>;
    chartConfig: ChartConfig;
    mappings: Record<string, string>;
    colorMap: Record<string, string>;
    metricKey?: MetricKey;
    className?: string;
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
    groupedData,
    selectedDevices,
    selectedMetrics,
    chartConfig,
    mappings,
    colorMap,
    metricKey,
    className = ""
}) => {
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

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: chartConfig.showLegend,
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
                    display: chartConfig.showAxisLabels,
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
                    display: chartConfig.showAxisLabels,
                    color: "#9CA3AF",
                },
                grid: { color: "#4B5563" },
                beginAtZero: true,
            },
        },
    };

    const datasets = metricKey
        ? createDatasets(metricKey)
        : METRICS.filter(m => selectedMetrics[m.key]).flatMap(m => createDatasets(m.key));

    return (
        <div className={className}>
            <Line
                options={chartOptions}
                data={{
                    labels: Object.values(groupedData)[0]?.timestamps || [],
                    datasets,
                }}
            />
        </div>
    );
};
