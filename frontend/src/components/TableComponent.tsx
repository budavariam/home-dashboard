import React from 'react';
import { MetricKey, GroupedData } from '../types';

interface TableComponentProps {
    groupedData: GroupedData;
    selectedDevices: string[];
    selectedMetric: MetricKey;
    selectedMetrics?: Record<MetricKey, boolean>; // Add this prop
    mappings: Record<string, string>;
    className?: string;
    splitView?: boolean;
}

export const TableComponent: React.FC<TableComponentProps> = ({
    groupedData,
    selectedDevices,
    selectedMetric,
    selectedMetrics,
    mappings,
    className = "",
    splitView = false
}) => {
    const devices = selectedDevices.filter(device => groupedData[device]);
    const uniqueTimestamps = Object.values(groupedData)[0]?.timestamps || [];

    const METRIC_ORDER: MetricKey[] = ['tmp', 'hum', 'bat'];

    // Filter metrics based on selection
    const activeMetrics = React.useMemo(() => {
        if (!selectedMetrics || splitView) {
            return METRIC_ORDER;
        }
        return METRIC_ORDER.filter(metric => selectedMetrics[metric]);
    }, [selectedMetrics, splitView]);

    const getMetricLabel = (metric: MetricKey): string => {
        switch (metric) {
            case 'hum': return 'Humidity (%)';
            case 'tmp': return 'Temperature (°C)';
            case 'bat': return 'Battery (%)';
            default: return metric;
        }
    };

    const getMetricShortLabel = (metric: MetricKey): string => {
        switch (metric) {
            case 'hum': return 'Hum';
            case 'tmp': return 'Tmp';
            case 'bat': return 'Bat';
            default: return metric;
        }
    };

    const formatValue = (value: number | null): string => {
        if (value === null) return 'N/A';
        return value.toFixed(1);
    };

    const formatCombinedValue = (device: string, timestampIndex: number): string => {
        return activeMetrics
            .map(metric => {
                const value = groupedData[device][metric][timestampIndex];
                return formatValue(value);
            })
            .join(' / ');
    };

    const getHeaderLabel = (): string => {
        if (!splitView) {
            return activeMetrics.map(m => getMetricShortLabel(m)).join(' / ');
        }
        return getMetricLabel(selectedMetric);
    };

    if (devices.length === 0 || uniqueTimestamps.length === 0) {
        return (
            <div className={`text-center text-gray-500 p-8 ${className}`}>
                No data available for table
            </div>
        );
    }

    if (!splitView && activeMetrics.length === 0) {
        return (
            <div className={`text-center text-gray-500 p-8 ${className}`}>
                No metrics selected
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                {!splitView ? 'All Metrics Data Table' : `${getMetricLabel(selectedMetric)} Data Table`}
            </h3>

            <div className="overflow-auto max-h-[600px] border border-gray-300 dark:border-gray-600 rounded">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 whitespace-nowrap">
                                Timestamp
                            </th>
                            {devices.map((device) => (
                                <th
                                    key={device}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 whitespace-nowrap"
                                >
                                    <div>{mappings[device] || device}</div>
                                    {!splitView && (
                                        <div className="text-xs font-normal text-gray-600 dark:text-gray-400 mt-1">
                                            {getHeaderLabel()}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {uniqueTimestamps.map((timestamp, timestampIndex) => (
                            <tr
                                key={timestampIndex}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
                            >
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap bg-gray-50 dark:bg-gray-800">
                                    {timestamp}
                                </td>
                                {devices.map((device) => {
                                    const displayValue = splitView
                                        ? formatValue(groupedData[device][selectedMetric][timestampIndex])
                                        : formatCombinedValue(device, timestampIndex);

                                    return (
                                        <td
                                            key={device}
                                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 text-right"
                                        >
                                            {displayValue}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
