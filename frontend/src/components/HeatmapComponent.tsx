import React from 'react';
import { MetricKey, GroupedData } from '../types';

interface HeatmapComponentProps {
    groupedData: GroupedData;
    selectedDevices: string[];
    selectedMetric: MetricKey;
    mappings: Record<string, string>;
    className?: string;
}

interface HeatmapCell {
    device: string;
    timestamp: string;
    value: number | null;
    timestampIndex: number;
}

export const HeatmapComponent: React.FC<HeatmapComponentProps> = ({
    groupedData,
    selectedDevices,
    selectedMetric,
    mappings,
    className = ""
}) => {
    const heatmapData: HeatmapCell[] = React.useMemo(() => {
        const data: HeatmapCell[] = [];

        Object.entries(groupedData)
            .filter(([device]) => selectedDevices.includes(device))
            .forEach(([device, deviceData]) => {
                deviceData.timestamps.forEach((timestamp, timestampIndex) => {
                    data.push({
                        device,
                        timestamp,
                        value: deviceData[selectedMetric][timestampIndex],
                        timestampIndex,
                    });
                });
            });

        return data;
    }, [groupedData, selectedDevices, selectedMetric]);

    const { minValue, maxValue } = React.useMemo(() => {
        const values = heatmapData
            .map(cell => cell.value)
            .filter((val): val is number => val !== null);

        return {
            minValue: values.length > 0 ? Math.min(...values) : 0,
            maxValue: values.length > 0 ? Math.max(...values) : 100,
        };
    }, [heatmapData]);

    const getHeatmapColor = (value: number | null): string => {
        if (value === null) return '#374151'; // gray-700

        const normalizedValue = (value - minValue) / (maxValue - minValue);

        // Create a color gradient from blue (cold) to red (hot)
        if (normalizedValue <= 0.5) {
            // Blue to yellow
            const intensity = normalizedValue * 2;
            return `rgb(${Math.round(intensity * 255)}, ${Math.round(intensity * 255)}, 255)`;
        } else {
            // Yellow to red
            const intensity = (normalizedValue - 0.5) * 2;
            return `rgb(255, ${Math.round(255 * (1 - intensity))}, 0)`;
        }
    };

    const uniqueTimestamps = Object.values(groupedData)[0]?.timestamps || [];
    const devices = selectedDevices.filter(device => groupedData[device]);

    if (devices.length === 0 || uniqueTimestamps.length === 0) {
        return (
            <div className={`text-center text-gray-500 p-8 ${className}`}>
                No data available for heatmap
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                {selectedMetric === 'hum' ? 'Humidity' : selectedMetric === 'tmp' ? 'Temperature' : 'Battery'} Heatmap
            </h3>

            <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                    {/* Header row with timestamps */}
                    <div className="flex">
                        <div className="w-32 flex-shrink-0"></div> {/* Empty corner cell */}
                        {uniqueTimestamps.map((timestamp, index) => (
                            <div
                                key={index}
                                className="w-16 h-8 flex items-center justify-center text-xs text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-600"
                                style={{ writingMode: 'sideways-lr', textOrientation: 'mixed' }}
                            >
                                {timestamp}
                            </div>
                        ))}
                    </div>

                    {/* Data rows */}
                    {devices.map((device) => (
                        <div key={device} className="flex border-t border-gray-200 dark:border-gray-600">
                            {/* Device name */}
                            <div className="w-32 flex-shrink-0 h-8 flex items-center px-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700">
                                {mappings[device] || device}
                            </div>

                            {/* Data cells */}
                            {groupedData[device][selectedMetric].map((value, timestampIndex) => (
                                <div
                                    key={timestampIndex}
                                    className="text-shadow-glow w-16 h-8 border-r border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
                                    style={{
                                        backgroundColor: getHeatmapColor(value),
                                        color: value === null ? '#9CA3AF' : '#000',
                                    }}
                                    title={`${mappings[device] || device} at ${uniqueTimestamps[timestampIndex]}: ${value ?? 'N/A'}`}
                                >
                                    {value !== null ? value.toFixed(1) : '-'}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
                <div className="flex h-4 w-32 rounded">
                    {Array.from({ length: 20 }, (_, i) => (
                        <div
                            key={i}
                            className="flex-1 h-full"
                            style={{
                                backgroundColor: getHeatmapColor(minValue + (maxValue - minValue) * (i / 19)),
                            }}
                        />
                    ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({minValue.toFixed(1)} - {maxValue.toFixed(1)})
                </span>
            </div>
        </div>
    );
};