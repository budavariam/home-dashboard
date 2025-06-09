import React from 'react';
import { TimeRange, MetricKey, ChartConfig } from '../types';
import { TimeRangeSelector } from './TimeRangeSelector';
import { MetricSelector } from './MetricSelector';
import { ChartConfigSelector } from './ChartConfigSelector';
import { DeviceSelector } from './DeviceSelector';

interface ChartControlsProps {
    timeRange: TimeRange;
    onTimeRangeChange: (timeRange: TimeRange) => void;
    selectedMetrics: Record<MetricKey, boolean>;
    onMetricsChange: (metrics: Record<MetricKey, boolean>) => void;
    chartConfig: ChartConfig;
    onChartConfigChange: (config: ChartConfig) => void;
    devices: string[];
    selectedDevices: string[];
    onDevicesChange: (devices: string[]) => void;
    mappings: Record<string, string>;
    colorMap: Record<string, string>;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
    timeRange,
    onTimeRangeChange,
    selectedMetrics,
    onMetricsChange,
    chartConfig,
    onChartConfigChange,
    devices,
    selectedDevices,
    onDevicesChange,
    mappings,
    colorMap,
}) => {
    return (
        <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4">
                <TimeRangeSelector
                    value={timeRange}
                    onChange={onTimeRangeChange}
                />

                <MetricSelector
                    selectedMetrics={selectedMetrics}
                    onChange={onMetricsChange}
                />

                <ChartConfigSelector
                    config={chartConfig}
                    onChange={onChartConfigChange}
                />
            </div>

            <DeviceSelector
                devices={devices}
                selectedDevices={selectedDevices}
                onChange={onDevicesChange}
                mappings={mappings}
                colorMap={colorMap}
            />
        </div>
    );
};