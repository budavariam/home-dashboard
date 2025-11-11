import React from 'react';
import { MetricKey, GroupedData } from '../types';

interface TableComponentProps {
    groupedData: GroupedData;
    selectedDevices: string[];
    selectedMetric: MetricKey;
    mappings: Record<string, string>;
    className?: string;
}

export const TableComponent: React.FC<TableComponentProps> = ({
    groupedData,
    selectedDevices,
    selectedMetric,
    mappings,
    className = ""
}) => {
    const devices = selectedDevices.filter(device => groupedData[device]);
    const uniqueTimestamps = Object.values(groupedData)[0]?.timestamps || [];

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

    if (devices.length === 0 || uniqueTimestamps.length === 0) {
        return (
            <div className={`text-center text-gray-500 p-8 ${className}`}>
                No data available for table
            </div>
        );
    }

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                {getMetricLabel(selectedMetric)} Data Table
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
                                    {mappings[device] || device}
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
                                    const value = groupedData[device][selectedMetric][timestampIndex];
                                    return (
                                        <td 
                                            key={device}
                                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 text-right"
                                        >
                                            {formatValue(value)}
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
