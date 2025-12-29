import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { useHistoricalData } from "../hooks/useHistoricalData";
import { useSensorParams } from "./context/ParamContext";
import { TimeRange, MetricKey, GroupedData, ChartConfig } from "../types";
import { QueryError } from "./QueryError";
import { ChartControls } from "./ChartControls";
import { LineChartComponent } from "./LineChartComponent";
import { HeatmapComponent } from "./HeatmapComponent";
import { TableComponent } from "./TableComponent";
import { formatTimestamp } from "../utils/time";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const COLORS = [
    "#3b82f6", "#f97316", "#10b981", "#eab308", "#8b5cf6",
    "#ef4444", "#84cc16", "#06b6d4", "#d946ef", "#6366f1",
    "#f59e0b", "#22c55e", "#0ea5e9", "#a855f7", "#ec4899"
];

type ViewMode = 'line' | 'heatmap' | 'table';

interface RenderViewProps {
    viewMode: ViewMode;
    splitCharts: boolean;
    groupedData: GroupedData;
    selectedDevices: string[];
    selectedMetrics: Record<MetricKey, boolean>;
    chartConfig: ChartConfig;
    mappings: Record<string, string>;
    colorMap: Record<string, string>;
}

const HistoricalChart: React.FC = () => {
    const { t } = useTranslation();

    const METRICS = [
        { key: "hum" as MetricKey, label: t('METRICS.HUMIDITY') },
        { key: "tmp" as MetricKey, label: t('METRICS.TEMPERATURE'), borderDash: [5, 5] },
        { key: "bat" as MetricKey, label: t('METRICS.BATTERY'), borderDash: [2, 2] },
    ];

    const [timeRange, setTimeRange] = useState<TimeRange>("6h");
    const [selectedMetrics, setSelectedMetrics] = useState<Record<MetricKey, boolean>>({
        hum: true,
        tmp: true,
        bat: false,
    });
    const [chartConfig, setChartConfig] = useState<ChartConfig>({
        showLegend: true,
        showAxisLabels: true,
        splitCharts: true,
        enableExtrapolation: false,
        forecastMethod: 'linear',
        forecastPoints: 5,
        forecastWindowSize: 10,
        compareLastPeriod: false,
        autoScaleY: false,
    });
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('line');
    const [colorMap, setColorMap] = useState<Record<string, string>>(() => {
        try {
            const storedColorMap = localStorage.getItem('deviceColorMap');
            return storedColorMap ? JSON.parse(storedColorMap) : {};
        } catch (e) {
            console.error("Failed to parse colorMap from localStorage", e);
            return {};
        }
    });

    const chartContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, isError, error, refetch } = useHistoricalData(timeRange, chartConfig.compareLastPeriod);
    const { mappings } = useSensorParams();

    const groupedData: GroupedData = React.useMemo(() => {
        const readings = data?.map((entry) => {
            const r = entry.val.readings;
            r.sort((a, b) => -1 * a.n.localeCompare(b.n));

            // Apply timestamp fallback logic: if reading.ts differs from root ts by more than a day,
            // use the root ts (this handles cases where devices fail to sync with NTP and default to year 2000)
            const rootTs = entry.ts;
            r.forEach(reading => {
                if (reading.ts) {
                    const readingTs = +new Date(reading.ts);
                    const diff = Math.abs(rootTs - readingTs);
                    const oneDayInMs = 86400000; // 24 * 60 * 60 * 1000

                    // If difference is more than a day, use root timestamp converted to ISO string
                    if (diff > oneDayInMs) {
                        reading.ts = new Date(rootTs).toISOString();
                    }
                }
            });

            return r;
        }).flat() || [];

        const allTimestamps = new Set<number>();
        readings.forEach(reading => {
            if (reading?.ts) allTimestamps.add(+new Date(reading.ts));
        });
        const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);
        const formattedTimestamps = sortedTimestamps.map(ts => formatTimestamp(ts));
        const result: GroupedData = {};

        readings.forEach(reading => {
            if (!reading?.n) return;
            if (!result[reading.n]) {
                result[reading.n] = {
                    hum: Array(sortedTimestamps.length).fill(null),
                    tmp: Array(sortedTimestamps.length).fill(null),
                    bat: Array(sortedTimestamps.length).fill(null),
                    timestamps: formattedTimestamps,
                };
            }
        });

        readings.forEach(reading => {
            if (!reading?.n || !reading?.ts || !reading?.r) return;

            const timeIndex = sortedTimestamps.indexOf(+new Date(reading.ts));
            if (timeIndex === -1) return;

            const device = result[reading.n];
            if (!device) return;

            if (typeof reading.r.hum === 'number') device.hum[timeIndex] = reading.r.hum;
            if (typeof reading.r.tmp === 'number') device.tmp[timeIndex] = reading.r.tmp;
            if (typeof reading.r.bat === 'number') device.bat[timeIndex] = reading.r.bat;
        });

        return result;
    }, [data]);

    useEffect(() => {
        const availableDevices = Object.keys(groupedData);
        if (availableDevices.length === 0) return;

        setColorMap(prev => {
            const newColorMap = { ...prev };
            let updated = false;

            availableDevices.forEach((device) => {
                if (!newColorMap[device]) {
                    const usedColors = Object.values(newColorMap);
                    const availableColors = COLORS.filter(c => !usedColors.includes(c));
                    const color = availableColors.length > 0
                        ? availableColors[0]
                        : COLORS[Math.floor(Math.random() * COLORS.length)];
                    newColorMap[device] = color;
                    updated = true;
                }
            });

            return updated ? newColorMap : prev;
        });
    }, [groupedData]);
    useEffect(() => {
        try {
            localStorage.setItem('deviceColorMap', JSON.stringify(colorMap));
        } catch (e) {
            console.error("Failed to save colorMap to localStorage", e);
        }
    }, [colorMap]);

    useEffect(() => {
        const availableDevices = Object.keys(groupedData);
        if (availableDevices.length === 0) {
            return;
        }

        setSelectedDevices(prev => {
            // On initial load or when no devices are selected, select all
            if (prev.length === 0) {
                return availableDevices;
            }

            // Keep only the devices that still exist in the new data
            const stillAvailable = prev.filter(device => availableDevices.includes(device));

            // If all previously selected devices are gone, select all new ones
            return stillAvailable.length > 0 ? stillAvailable : availableDevices;
        });
    }, [groupedData]);


    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            Array.from(container.getElementsByTagName('canvas')).forEach(chart => {
                ChartJS.getChart(chart)?.resize();
            });
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    const renderSplitView = (props: RenderViewProps): React.ReactNode => {
        const { viewMode, groupedData, selectedDevices, selectedMetrics, mappings, colorMap, chartConfig } = props;

        const activeMetrics = METRICS.filter(({ key }) => selectedMetrics[key]);

        return activeMetrics.map(({ key }) => {
            switch (viewMode) {
                case 'line':
                    return (
                        <LineChartComponent
                            key={key}
                            groupedData={groupedData}
                            selectedDevices={selectedDevices}
                            selectedMetrics={selectedMetrics}
                            mappings={mappings}
                            colorMap={colorMap}
                            metricKey={key}
                            className="mb-6 h-[400px]"
                            lineChartConfig={{
                                showLegend: chartConfig.showLegend,
                                showAxisLabels: chartConfig.showAxisLabels,
                                autoScaleY: chartConfig.autoScaleY ?? false,
                                extrapolation: {
                                    enabled: chartConfig.enableExtrapolation || false,
                                    method: chartConfig.forecastMethod || 'linear',
                                    points: chartConfig.forecastPoints || 5,
                                    windowSize: chartConfig.forecastWindowSize || 10,
                                },
                                compareLastPeriod: chartConfig.compareLastPeriod,
                            }}
                            onLineChartConfigChange={(newConfig) => {
                                setChartConfig(prevConfig => ({
                                    ...prevConfig,
                                    ...newConfig,
                                }));
                            }}
                        />
                    );

                case 'heatmap':
                    return (
                        <HeatmapComponent
                            key={key}
                            groupedData={groupedData}
                            selectedDevices={selectedDevices}
                            selectedMetric={key}
                            mappings={mappings}
                            className="mb-6"
                        />
                    );

                case 'table':
                    return (
                        <TableComponent
                            key={key}
                            groupedData={groupedData}
                            selectedDevices={selectedDevices}
                            selectedMetric={key}
                            mappings={mappings}
                            className="mb-6"
                            splitView={true}
                            extrapolation={chartConfig.enableExtrapolation ? {
                                enabled: true,
                                method: chartConfig.forecastMethod || 'linear',
                                points: chartConfig.forecastPoints || 5,
                                windowSize: chartConfig.forecastWindowSize || 10,
                            } : undefined}
                            compareLastPeriod={chartConfig.compareLastPeriod}
                        />
                    );

                default:
                    return null;
            }
        });
    };

    const renderCombinedView = (props: RenderViewProps): React.ReactNode => {
        const { viewMode, groupedData, selectedDevices, selectedMetrics, mappings, colorMap, chartConfig } = props;

        switch (viewMode) {
            case 'line':
                return (
                    <LineChartComponent
                        groupedData={groupedData}
                        selectedDevices={selectedDevices}
                        selectedMetrics={selectedMetrics}
                        mappings={mappings}
                        colorMap={colorMap}
                        className="h-[400px]"
                        lineChartConfig={{
                            showLegend: chartConfig.showLegend,
                            showAxisLabels: chartConfig.showAxisLabels,
                            autoScaleY: chartConfig.autoScaleY ?? false,
                            extrapolation: {
                                enabled: chartConfig.enableExtrapolation || false,
                                method: chartConfig.forecastMethod || 'linear',
                                points: chartConfig.forecastPoints || 5,
                                windowSize: chartConfig.forecastWindowSize || 10,
                            },
                            compareLastPeriod: chartConfig.compareLastPeriod,
                        }}
                        onLineChartConfigChange={(newConfig) => {
                            setChartConfig(prevConfig => ({
                                ...prevConfig,
                                ...newConfig,
                            }));
                        }}
                    />
                );

            case 'heatmap':
                return (
                    <div className="text-center text-gray-500 p-8">
                        {t('HISTORY.HEATMAP_NO_COMBINED')}
                    </div>
                );


            case 'table':
                return (
                    <TableComponent
                        groupedData={groupedData}
                        selectedDevices={selectedDevices}
                        selectedMetric="hum"
                        selectedMetrics={selectedMetrics}
                        mappings={mappings}
                        className="mb-6"
                        splitView={false}
                        extrapolation={chartConfig.enableExtrapolation ? {
                            enabled: true,
                            method: chartConfig.forecastMethod || 'linear',
                            points: chartConfig.forecastPoints || 5,
                            windowSize: chartConfig.forecastWindowSize || 10,
                        } : undefined}
                        compareLastPeriod={chartConfig.compareLastPeriod}
                    />
                );

            default:
                return null;
        }
    };

    const renderView = (): React.ReactNode => {
        const renderProps: RenderViewProps = {
            viewMode,
            splitCharts: chartConfig.splitCharts,
            groupedData,
            selectedDevices,
            selectedMetrics,
            chartConfig,
            mappings,
            colorMap,
        };

        if (chartConfig.splitCharts) {
            return renderSplitView(renderProps);
        }

        return renderCombinedView(renderProps);
    };

    if (isError) return <QueryError error={error} refetch={refetch} />;

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded shadow-lg">
            {/* View Mode Toggle */}
            <div className="mb-4 flex gap-2 items-center flex-wrap">
                <span className="text-gray-700 dark:text-gray-300 font-medium">{t('HISTORY.VIEW_MODE')}</span>
                <button
                    onClick={() => setViewMode('line')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === 'line'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                >
                    {t('HISTORY.LINE_CHART')}
                </button>
                <button
                    onClick={() => setViewMode('heatmap')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === 'heatmap'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                >
                    {t('HISTORY.HEATMAP')}
                </button>
                <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === 'table'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                >
                    {t('HISTORY.TABLE')}
                </button>
            </div>

            <ChartControls
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
                selectedMetrics={selectedMetrics}
                onMetricsChange={setSelectedMetrics}
                chartConfig={chartConfig}
                onChartConfigChange={setChartConfig}
                devices={Object.keys(groupedData)}
                selectedDevices={selectedDevices}
                onDevicesChange={setSelectedDevices}
                mappings={mappings}
                colorMap={colorMap}
                viewMode={viewMode}
            />

            {isLoading && (
                <div className="text-center text-gray-700 dark:text-gray-300 mb-2">
                    {t('HISTORY.LOADING')}
                </div>
            )}

            <div ref={chartContainerRef} className="w-full">
                {renderView()}
            </div>
        </div>
    );
};

export default HistoricalChart;
