import React, { useState, useMemo } from 'react';
import { MetricKey, GroupedData } from '../types';

interface TableComponentProps {
    groupedData: GroupedData;
    selectedDevices: string[];
    selectedMetric: MetricKey;
    selectedMetrics?: Record<MetricKey, boolean>;
    mappings: Record<string, string>;
    className?: string;
    splitView?: boolean;
}

type SortConfig = {
    key: 'timestamp' | string; // 'timestamp' or device name
    direction: 'asc' | 'desc';
} | null;

const METRIC_ORDER: MetricKey[] = ['tmp', 'hum', 'bat'];
export const TableComponent: React.FC<TableComponentProps> = ({
    groupedData,
    selectedDevices,
    selectedMetric,
    selectedMetrics,
    mappings,
    className = "",
    splitView = true
}) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    const devices = selectedDevices.filter(device => groupedData[device]);
    const uniqueTimestamps = useMemo(() => Object.values(groupedData)[0]?.timestamps || [], [groupedData]);


    // Filter metrics based on selection
    const activeMetrics = useMemo(() => {
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

    const getTitle = (): string => {
        if (splitView) {
            return `${getMetricLabel(selectedMetric)} Data Table`;
        }
        const metricLabels = activeMetrics.map(m => getMetricLabel(m)).join(', ');
        return metricLabels ? `${metricLabels} Data Table` : 'Data Table';
    };

    // Sorting function
    const handleSort = (key: 'timestamp' | string) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };

    // Get sorted data indices
    const sortedIndices = useMemo(() => {
        const indices = uniqueTimestamps.map((_, index) => index);

        if (!sortConfig) {
            return indices;
        }

        return [...indices].sort((a, b) => {
            let aValue: string | number | null;
            let bValue: string | number | null;

            if (sortConfig.key === 'timestamp') {
                aValue = uniqueTimestamps[a];
                bValue = uniqueTimestamps[b];
            } else {
                // Sorting by device column
                const device = sortConfig.key;
                if (splitView) {
                    aValue = groupedData[device][selectedMetric][a];
                    bValue = groupedData[device][selectedMetric][b];
                } else {
                    // For combined view, sort by first selected metric
                    const firstMetric = activeMetrics[0];
                    aValue = groupedData[device][firstMetric][a];
                    bValue = groupedData[device][firstMetric][b];
                }
            }

            // Handle null values
            if (aValue === null && bValue === null) return 0;
            if (aValue === null) return 1;
            if (bValue === null) return -1;

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [uniqueTimestamps, sortConfig, groupedData, selectedMetric, splitView, activeMetrics]);

    // Sort indicator component
    const SortIndicator: React.FC<{ columnKey: string }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <span className="text-gray-400 ml-1">⇅</span>;
        }
        return (
            <span className="ml-1">
                {sortConfig.direction === 'asc' ? '▲' : '▼'}
            </span>
        );
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
                {getTitle()}
            </h3>

            <div className="overflow-auto max-h-[600px] border border-gray-300 dark:border-gray-600 rounded">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                        <tr>
                            <th
                                className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => handleSort('timestamp')}
                            >
                                Timestamp
                                <SortIndicator columnKey="timestamp" />
                            </th>
                            {devices.map((device) => (
                                <th
                                    key={device}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    onClick={() => handleSort(device)}
                                >
                                    {mappings[device] || device}
                                    <SortIndicator columnKey={device} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedIndices.map((timestampIndex) => (
                            <tr
                                key={timestampIndex}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
                            >
                                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap bg-gray-50 dark:bg-gray-800">
                                    {uniqueTimestamps[timestampIndex]}
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
