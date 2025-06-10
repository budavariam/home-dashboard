import React from 'react';
import classNames from 'classnames';
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
    const [hoveredCell, setHoveredCell] = React.useState<{ x: number; y: number; value: number | null; device: string; timestamp: string } | null>(null);
    const [mousePosition, setMousePosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [hoveredLegendSegment, setHoveredLegendSegment] = React.useState<number | null>(null);

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

    const getLegendTitle = (segmentIndex: number | null): string => {
        if (segmentIndex === null) return "";
        
        const value = minValue + (maxValue - minValue) * (segmentIndex / 19);
        const unit = selectedMetric === 'hum' ? '%' : selectedMetric === 'tmp' ? '°C' : '%';
        
        return `${value.toFixed(1)}${unit}`;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleCellHover = (device: string, timestamp: string, value: number | null, e: React.MouseEvent) => {
        setHoveredCell({ x: e.clientX, y: e.clientY, value, device, timestamp });
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleCellLeave = () => {
        setHoveredCell(null);
    };

    const handleLegendSegmentHover = (segmentIndex: number) => {
        setHoveredLegendSegment(segmentIndex);
    };

    const handleLegendSegmentLeave = () => {
        setHoveredLegendSegment(null);
    };

    const uniqueTimestamps = Object.values(groupedData)[0]?.timestamps || [];
    const devices = selectedDevices.filter(device => groupedData[device]);

    // Function to check if a new day starts at this timestamp index
    const isNewDay = (timestampIndex: number): boolean => {
        if (timestampIndex === 0) return false;
        
        const currentTimestamp = uniqueTimestamps[timestampIndex];
        const previousTimestamp = uniqueTimestamps[timestampIndex - 1];
        
        // Extract date part (assuming format like "2024-01-15 10:30" or similar)
        const currentDate = currentTimestamp.split(' ')[0];
        const previousDate = previousTimestamp.split(' ')[0];
        
        return currentDate !== previousDate;
    };

    if (devices.length === 0 || uniqueTimestamps.length === 0) {
        return (
            <div className={`text-center text-gray-500 p-8 ${className}`}>
                No data available for heatmap
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 relative ${className}`} onMouseMove={handleMouseMove}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                {selectedMetric === 'hum' ? 'Humidity' : selectedMetric === 'tmp' ? 'Temperature' : 'Battery'} Heatmap
            </h3>

            <div className="w-full">
                {/* Data rows */}
                {devices.map((device) => (
                    <div key={device} className="flex w-full">
                        {/* Device name */}
                        <div className="w-32 flex-shrink-0 h-8 flex items-center px-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700">
                            {mappings[device] || device}
                        </div>

                        {/* Data cells */}
                        <div className="flex-1 flex">
                            {groupedData[device][selectedMetric].map((value, timestampIndex) => (
                                <div
                                    key={timestampIndex}
                                    className={classNames(
                                        'flex-1 h-8 cursor-pointer hover:opacity-80 transition-opacity relative',
                                        {
                                            'border-l-2 border-gray-400 border-opacity-50': isNewDay(timestampIndex)
                                        }
                                    )}
                                    style={{
                                        backgroundColor: getHeatmapColor(value),
                                    }}
                                    onMouseEnter={(e) => handleCellHover(device, uniqueTimestamps[timestampIndex], value, e)}
                                    onMouseLeave={handleCellLeave}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Color Legend */}
            <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Low</span>
                <div 
                    className="flex h-4 w-32 rounded cursor-crosshair"
                    title={getLegendTitle(hoveredLegendSegment)}
                >
                    {Array.from({ length: 20 }, (_, i) => (
                        <div
                            key={i}
                            className="flex-1 h-full hover:opacity-30 transition-opacity"
                            style={{
                                backgroundColor: getHeatmapColor(minValue + (maxValue - minValue) * (i / 19)),
                            }}
                            onMouseEnter={() => handleLegendSegmentHover(i)}
                            onMouseLeave={handleLegendSegmentLeave}
                        />
                    ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">High</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({minValue.toFixed(1)} - {maxValue.toFixed(1)})
                </span>
            </div>

            {/* Hover Tooltip */}
            {hoveredCell && (
                <div
                    className="fixed bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg z-50 pointer-events-none"
                    style={{
                        left: mousePosition.x + 10,
                        top: mousePosition.y - 10,
                        transform: mousePosition.x > window.innerWidth - 200 ? 'translateX(-100%)' : 'none',
                    }}
                >
                    <div className="font-medium">{mappings[hoveredCell.device] || hoveredCell.device}</div>
                    <div className="text-gray-300">{hoveredCell.timestamp}</div>
                    <div className="text-gray-300">
                        Value: {hoveredCell.value !== null ? hoveredCell.value.toFixed(1) : 'N/A'}
                    </div>
                </div>
            )}
        </div>
    );
};