import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
    compareLastPeriod?: boolean;
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
    splitView = true,
    compareLastPeriod = false,
}) => {
    const { t } = useTranslation();
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'timestamp', direction: 'desc' });

    // Determine active metrics for display
    const activeMetrics = useMemo(() => {
        if (splitView) {
            return [selectedMetric];
        }
        if (!selectedMetrics) {
            return METRIC_ORDER;
        }
        return METRIC_ORDER.filter(metric => selectedMetrics[metric]);
    }, [selectedMetrics, splitView, selectedMetric]);

    // Split data into current and previous periods if comparison is enabled
    const { currentData, previousData, uniqueTimestamps, originalLength } = useMemo(() => {
        const firstDevice = Object.values(groupedData)[0];
        if (!firstDevice) {
            return { currentData: {}, previousData: null, uniqueTimestamps: [], originalLength: 0 };
        }

        if (!compareLastPeriod) {
            const extrapolated = extrapolateGroupedData(groupedData, extrapolation || { enabled: false, method: 'linear', points: 5, windowSize: 10 });
            const origLen = firstDevice.timestamps.length;
            return {
                currentData: extrapolated,
                previousData: null,
                uniqueTimestamps: Object.values(extrapolated)[0]?.timestamps || [],
                originalLength: origLen
            };
        }

        const midpoint = Math.floor(firstDevice.timestamps.length / 2);
        const currentTimestamps = firstDevice.timestamps.slice(midpoint);

        const current: GroupedData = {};
        const previous: GroupedData = {};

        for (const device in groupedData) {
            current[device] = { timestamps: [], hum: [], tmp: [], bat: [] };
            previous[device] = { timestamps: [], hum: [], tmp: [], bat: [] };

            for (const key of METRIC_ORDER) {
                const data = groupedData[device][key] || [];
                current[device][key] = data.slice(midpoint);
                previous[device][key] = data.slice(0, midpoint);
            }
            current[device].timestamps = currentTimestamps;
            previous[device].timestamps = currentTimestamps;
        }

        const extrapolated = extrapolateGroupedData(current, extrapolation || { enabled: false, method: 'linear', points: 5, windowSize: 10 });
        const origLen = currentTimestamps.length;
        const newLabels = Object.values(extrapolated)[0]?.timestamps || [];

        return {
            currentData: extrapolated,
            previousData: previous,
            uniqueTimestamps: newLabels,
            originalLength: origLen
        };
    }, [groupedData, extrapolation, compareLastPeriod]);

    const processedData = currentData;
    const devices = selectedDevices.filter(device => processedData[device]);

    const calculateStats = useMemo(() => {
        const stats: Record<string, Record<MetricKey, { avg: number; median: number; min: number; max: number }>> = {};

        devices.forEach(device => {
            stats[device] = {} as Record<MetricKey, { avg: number; median: number; min: number; max: number }>;

            // Calculate stats for each active metric
            activeMetrics.forEach(metric => {
                const values = currentData[device]?.[metric]
                    ?.slice(0, originalLength)
                    .filter((v): v is number => v !== null && v !== undefined) || [];

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
        });

        return stats;
    }, [devices, currentData, activeMetrics, originalLength]);

    const calculatePreviousStats = useMemo(() => {
        if (!compareLastPeriod || !previousData) return null;

        const stats: Record<string, Record<MetricKey, { avg: number; median: number; min: number; max: number }>> = {};

        devices.forEach(device => {
            stats[device] = {} as Record<MetricKey, { avg: number; median: number; min: number; max: number }>;

            // Calculate stats for each active metric from previous period
            activeMetrics.forEach(metric => {
                const values = previousData[device]?.[metric]
                    ?.filter((v): v is number => v !== null && v !== undefined) || [];

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
        });

        return stats;
    }, [devices, previousData, activeMetrics, compareLastPeriod]);

    const getMetricLabel = (metric: MetricKey): string => {
        switch (metric) {
            case 'hum': return t('METRICS.HUMIDITY_UNIT');
            case 'tmp': return t('METRICS.TEMPERATURE_UNIT');
            case 'bat': return t('METRICS.BATTERY_UNIT');
            default: return metric;
        }
    };

    const formatValue = (value: number | null | undefined, isExtrapolated: boolean = false): string => {
        if (value === null || value === undefined) return 'N/A';
        return isExtrapolated ? `~${value.toFixed(1)}` : value.toFixed(1);
    };

    const formatStatValue = (value: number): string => {
        return value.toFixed(2);
    };

    const formatCombinedValue = (device: string, timestampIndex: number, isExtrapolated: boolean = false): string => {
        return activeMetrics
            .map(metric => {
                const value = processedData[device]?.[metric]?.[timestampIndex];
                return formatValue(value, isExtrapolated);
            })
            .join(' / ');
    };

    const formatCombinedStats = (device: string, statType: 'avg' | 'median' | 'min' | 'max'): string => {
        return activeMetrics
            .map(metric => {
                const value = calculateStats[device]?.[metric]?.[statType];
                return value !== undefined ? formatStatValue(value) : 'N/A';
            })
            .join(' / ');
    };

    const formatCombinedPreviousStats = (device: string, statType: 'avg' | 'median' | 'min' | 'max'): string => {
        if (!calculatePreviousStats) return 'N/A';
        return activeMetrics
            .map(metric => {
                const value = calculatePreviousStats[device]?.[metric]?.[statType];
                return value !== undefined ? formatStatValue(value) : 'N/A';
            })
            .join(' / ');
    };

    const getTitle = (): string => {
        const metricLabels = activeMetrics.map(m => getMetricLabel(m)).join(', ');
        return metricLabels ? `${metricLabels} ${t('TABLE.TITLE')}` : t('TABLE.TITLE');
    };

    const getStatLabel = (statType: string): string => {
        switch (statType) {
            case 'min':
                return t('TABLE.STATS.MIN');
            case 'avg':
                return t('TABLE.STATS.AVG');
            case 'median':
                return t('TABLE.STATS.MEDIAN');
            case 'max':
                return t('TABLE.STATS.MAX');
            default:
                return statType;
        }
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
            let aValue: string | number | null | undefined;
            let bValue: string | number | null | undefined;

            if (sortConfig.key === 'timestamp') {
                aValue = uniqueTimestamps[a];
                bValue = uniqueTimestamps[b];
            } else {
                const device = sortConfig.key;
                const firstMetric = activeMetrics[0];
                aValue = processedData[device]?.[firstMetric]?.[a];
                bValue = processedData[device]?.[firstMetric]?.[b];
            }

            if ((aValue === null || aValue === undefined) && (bValue === null || bValue === undefined)) return 0;
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [uniqueTimestamps, sortConfig, processedData, activeMetrics]);

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
                {t('TABLE.NO_DATA')}
            </div>
        );
    }

    if (activeMetrics.length === 0) {
        return (
            <div className={`text-center text-gray-500 p-8 ${className}`}>
                {t('TABLE.NO_METRICS')}
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
                        {originalLength} {t('TABLE.ACTUAL')} + {uniqueTimestamps.length - originalLength} {t('TABLE.FORECAST_ROWS')}
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
                                {t('TABLE.TIMESTAMP')}
                                <SortIndicator columnKey="timestamp" />
                            </th>
                            {devices.map((device) => (
                                <React.Fragment key={device}>
                                    <th
                                        className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        onClick={() => handleSort(device)}
                                    >
                                        {mappings[device] || device}
                                        <SortIndicator columnKey={device} />
                                    </th>
                                    {compareLastPeriod && previousData && (
                                        <th
                                            className="px-4 py-3 text-left text-sm font-semibold text-gray-500 dark:text-gray-400 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 whitespace-nowrap"
                                        >
                                            {mappings[device] || device} {t('TABLE.PREVIOUS')}
                                        </th>
                                    )}
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedIndices.map((timestampIndex) => {
                            const isExtrapolated = timestampIndex >= originalLength;
                            return (
                                <tr
                                    key={timestampIndex}
                                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 ${isExtrapolated ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                        }`}
                                >
                                    <td className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${isExtrapolated
                                            ? 'text-blue-700 dark:text-blue-300 italic'
                                            : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                        {isExtrapolated && '📊 '}
                                        {uniqueTimestamps[timestampIndex]}
                                    </td>
                                    {devices.map((device) => {
                                        const displayValue = formatCombinedValue(device, timestampIndex, isExtrapolated);

                                        const previousValue = compareLastPeriod && previousData && timestampIndex < originalLength
                                            ? activeMetrics.map(metric => {
                                                const val = previousData[device]?.[metric]?.[timestampIndex];
                                                return formatValue(val, false);
                                            }).join(' / ')
                                            : null;

                                        return (
                                            <React.Fragment key={device}>
                                                <td
                                                    className={`px-4 py-2 text-sm text-right ${isExtrapolated
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
                                                {compareLastPeriod && previousData && (
                                                    <td
                                                        className="px-4 py-2 text-sm text-right text-gray-500 dark:text-gray-400"
                                                        style={{
                                                            fontFamily: 'monospace',
                                                            fontVariantNumeric: 'tabular-nums',
                                                            fontFeatureSettings: '"tnum"'
                                                        }}
                                                    >
                                                        {previousValue || 'N/A'}
                                                    </td>
                                                )}
                                            </React.Fragment>
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
                                    {getStatLabel(statType)}
                                </td>
                                {devices.map((device) => {
                                    const displayValue = formatCombinedStats(device, statType as 'avg' | 'median' | 'min' | 'max');
                                    const previousDisplayValue = compareLastPeriod && calculatePreviousStats
                                        ? formatCombinedPreviousStats(device, statType as 'avg' | 'median' | 'min' | 'max')
                                        : null;

                                    return (
                                        <React.Fragment key={device}>
                                            <td
                                                className="px-4 py-2 text-sm font-semibold text-gray-800 dark:text-gray-200 text-right"
                                                style={{
                                                    fontFamily: 'monospace',
                                                    fontVariantNumeric: 'tabular-nums',
                                                    fontFeatureSettings: '"tnum"'
                                                }}
                                            >
                                                {displayValue}
                                            </td>
                                            {compareLastPeriod && previousData && (
                                                <td
                                                    className="px-4 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 text-right"
                                                    style={{
                                                        fontFamily: 'monospace',
                                                        fontVariantNumeric: 'tabular-nums',
                                                        fontFeatureSettings: '"tnum"'
                                                    }}
                                                >
                                                    {previousDisplayValue || 'N/A'}
                                                </td>
                                            )}
                                        </React.Fragment>
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
