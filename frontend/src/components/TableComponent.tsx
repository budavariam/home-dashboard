import React, { useState, useMemo } from 'react';
import { MetricKey, GroupedData } from '../types';
import { extrapolateGroupedData, ExtrapolationConfig } from '../utils/extrapolation';

interface TableComponentProps {
    groupedData: GroupedData;
    selectedDevices: string[];
    selectedMetric: MetricKey;
    selectedMetrics?: Record<MetricKey, boolean>;
    mappings: Record<string, string>;
    className?: string;
    splitView?: boolean;
    extrapolation?: ExtrapolationConfig;
}

type SortConfig = {
    key: 'timestamp' | string;
    direction: 'asc' | 'desc';
} | null;

const METRIC_ORDER: MetricKey[] = ['tmp', 'hum', 'bat'];

export const TableComponent: React.FC<TableComponentProps> = ({
    groupedData,
    selectedDevices,
    selectedMetric,
    selectedMetrics,
    mappings,
    extrapolation,
    className = "",
    splitView = true
}) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'timestamp', direction: 'desc' });

    // Apply extrapolation if enabled
    const processedData = useMemo(() => {
        if (!extrapolation || !extrapolation.enabled) return groupedData;
        return extrapolateGroupedData(groupedData, extrapolation);
    }, [groupedData, extrapolation]);

    const originalLength = Object.values(groupedData)[0]?.timestamps.length || 0;
    const devices = selectedDevices.filter(device => processedData[device]);
    const uniqueTimestamps = useMemo(() => Object.values(processedData)[0]?.timestamps || [], [processedData]);

    const activeMetrics = useMemo(() => {
        if (!selectedMetrics || splitView) {
            return METRIC_ORDER;
        }
        return METRIC_ORDER.filter(metric => selectedMetrics[metric]);
    }, [selectedMetrics, splitView]);

    // Calculate statistics for each device and metric (only on original data, not extrapolated)
    const calculateStats = useMemo(() => {
        const stats: Record<string, Record<MetricKey, { avg: number; median: number; min: number; max: number }>> = {};

        devices.forEach(device => {
            stats[device] = {} as Record<MetricKey, { avg: number; median: number; min: number; max: number }>;

            if (splitView) {
                // For split view, calculate stats for the selected metric only
                // Use only original data for statistics
                const values = groupedData[device][selectedMetric]
                    .slice(0, originalLength)
                    .filter((v): v is number => v !== null);

                if (values.length === 0) {
                    stats[device][selectedMetric] = { avg: 0, median: 0, min: 0, max: 0 };
                } else {
                    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
                    const min = Math.min(...values);
                    const max = Math.max(...values);

                    const sorted = [...values].sort((a, b) => a - b);
                    const mid = Math.floor(sorted.length / 2);
                    const median = sorted.length % 2 === 0
                        ? (sorted[mid - 1] + sorted[mid]) / 2
                        : sorted[mid];

                    stats[device][selectedMetric] = { avg, median, min, max };
                }
            } else {
                // For combined view, calculate stats for each active metric separately
                activeMetrics.forEach(metric => {
                    const values = groupedData[device][metric]
                        .slice(0, originalLength)
                        .filter((v): v is number => v !== null);

                    if (values.length === 0) {
                        stats[device][metric] = { avg: 0, median: 0, min: 0, max: 0 };
                    } else {
                        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
                        const min = Math.min(...values);
                        const max = Math.max(...values);

                        const sorted = [...values].sort((a, b) => a - b);
                        const mid = Math.floor(sorted.length / 2);
                        const median = sorted.length % 2 === 0
                            ? (sorted[mid - 1] + sorted[mid]) / 2
                            : sorted[mid];

                        stats[device][metric] = { avg, median, min, max };
                    }
                });
            }
        });

        return stats;
    }, [devices, groupedData, selectedMetric, splitView, activeMetrics, originalLength]);

    const getMetricLabel = (metric: MetricKey): string => {
        switch (metric) {
            case 'hum': return 'Humidity (%)';
            case 'tmp': return 'Temperature (°C)';
            case 'bat': return 'Battery (%)';
            default: return metric;
        }
    };

    const formatValue = (value: number | null, isExtrapolated: boolean = false): string => {
        if (value === null) return 'N/A';
        return isExtrapolated ? `~${value.toFixed(1)}` : value.toFixed(1);
    };

    const formatStatValue = (value: number): string => {
        return value.toFixed(2);
    };

    const formatCombinedValue = (device: string, timestampIndex: number, isExtrapolated: boolean = false): string => {
        return activeMetrics
            .map(metric => {
                const value = processedData[device][metric][timestampIndex];
                return formatValue(value, isExtrapolated);
            })
            .join(' / ');
    };

    const formatCombinedStats = (device: string, statType: 'avg' | 'median' | 'min' | 'max'): string => {
        return activeMetrics
            .map(metric => {
                const value = calculateStats[device][metric][statType];
                return formatStatValue(value);
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

    const handleSort = (key: 'timestamp' | string) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };

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
                const device = sortConfig.key;
                if (splitView) {
                    aValue = processedData[device][selectedMetric][a];
                    bValue = processedData[device][selectedMetric][b];
                } else {
                    const firstMetric = activeMetrics[0];
                    aValue = processedData[device][firstMetric][a];
                    bValue = processedData[device][firstMetric][b];
                }
            }

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
    }, [uniqueTimestamps, sortConfig, processedData, selectedMetric, splitView, activeMetrics]);

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

    const hasExtrapolation = extrapolation?.enabled && uniqueTimestamps.length > originalLength;

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {getTitle()}
                </h3>
                {hasExtrapolation && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 italic">
                        {originalLength} actual + {uniqueTimestamps.length - originalLength} forecast rows
                    </span>
                )}
            </div>

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
                        {sortedIndices.map((timestampIndex) => {
                            const isExtrapolated = timestampIndex >= originalLength;
                            return (
                                <tr
                                    key={timestampIndex}
                                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                                        isExtrapolated ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                >
                                    <td className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                                        isExtrapolated 
                                            ? 'text-blue-700 dark:text-blue-300 italic' 
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                        {isExtrapolated && '📊 '}
                                        {uniqueTimestamps[timestampIndex]}
                                    </td>
                                    {devices.map((device) => {
                                        const displayValue = splitView
                                            ? formatValue(processedData[device][selectedMetric][timestampIndex], isExtrapolated)
                                            : formatCombinedValue(device, timestampIndex, isExtrapolated);

                                        return (
                                            <td
                                                key={device}
                                                className={`px-4 py-2 text-sm text-right ${
                                                    isExtrapolated 
                                                        ? 'text-blue-700 dark:text-blue-300 italic' 
                                                        : 'text-gray-700 dark:text-gray-300'
                                                }`}
                                                style={{
                                                    fontFamily: 'monospace',
                                                    fontVariantNumeric: 'tabular-nums',
                                                    fontFeatureSettings: '"tnum"'
                                                }}
                                            >
                                                {displayValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-gray-100 dark:bg-gray-700 sticky bottom-0">
                        {['min', 'avg', 'median', 'max'].map((statType) => (
                            <tr key={statType} className="border-t-2 border-gray-300 dark:border-gray-600">
                                <td className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                    {statType.charAt(0).toUpperCase() + statType.slice(1)}
                                </td>
                                {devices.map((device) => {
                                    const displayValue = splitView
                                        ? formatStatValue(calculateStats[device][selectedMetric][statType as keyof typeof calculateStats[string][MetricKey]])
                                        : formatCombinedStats(device, statType as 'avg' | 'median' | 'min' | 'max');

                                    return (
                                        <td
                                            key={device}
                                            className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 text-right"
                                            style={{
                                                fontFamily: 'monospace',
                                                fontVariantNumeric: 'tabular-nums',
                                                fontFeatureSettings: '"tnum"'
                                            }}
                                        >
                                            {displayValue}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tfoot>
                </table>
            </div>
        </div>
    );
};
