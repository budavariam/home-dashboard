import React, { useState, useRef, useEffect } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const COLORS = ["#3b82f6", "#f97316", "#10b981", "#eab308", "#8b5cf6"];

const METRICS = [
    { key: "hum" as MetricKey, label: "Humidity" },
    { key: "tmp" as MetricKey, label: "Temperature", borderDash: [5, 5] },
    { key: "bat" as MetricKey, label: "Battery", borderDash: [2, 2] },
];

const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}.${day} ${timeStr}`;
};

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
    });
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('line');

    const chartContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, isError, error, refetch } = useHistoricalData(timeRange);
    const { mappings } = useSensorParams();

    const groupedData: GroupedData = React.useMemo(() => {
        const readings = data?.map((entry) => {
            const r = entry.val.readings;
            r.sort((a, b) => -1 * a.n.localeCompare(b.n));
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
        console.log({ availableDevices });
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
            console.log({ groupedData, availableDevices, stillAvailable });
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
        const { viewMode, groupedData, selectedDevices, selectedMetrics, chartConfig, mappings, colorMap } = props;

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
                            chartConfig={chartConfig}
                            mappings={mappings}
                            colorMap={colorMap}
                            metricKey={key}
                            className="mb-6 h-[400px]"
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
                        />
                    );

                default:
                    return null;
            }
        });
    };

    const renderCombinedView = (props: RenderViewProps): React.ReactNode => {
        const { viewMode, groupedData, selectedDevices, selectedMetrics, chartConfig, mappings, colorMap } = props;

        switch (viewMode) {
            case 'line':
                return (
                    <LineChartComponent
                        groupedData={groupedData}
                        selectedDevices={selectedDevices}
                        selectedMetrics={selectedMetrics}
                        chartConfig={chartConfig}
                        mappings={mappings}
                        colorMap={colorMap}
                        className="h-[400px]"
                    />
                );

            case 'heatmap':
                return (
                    <div className="text-center text-gray-500 p-8">
                        Heatmap does not support combined chart mode. Please enable "Split Charts" in settings.
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

    const colorMap: Record<string, string> = Object.keys(groupedData).reduce((acc, device, index) => ({
        ...acc,
        [device]: COLORS[index % COLORS.length],
    }), {});

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded shadow-lg">
            {/* View Mode Toggle */}
            <div className="mb-4 flex gap-2 items-center flex-wrap">
                <span className="text-gray-700 dark:text-gray-300 font-medium">View Mode:</span>
                <button
                    onClick={() => setViewMode('line')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === 'line'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                >
                    Line Chart
                </button>
                <button
                    onClick={() => setViewMode('heatmap')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === 'heatmap'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                >
                    Heatmap
                </button>
                <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 rounded text-sm transition-colors ${viewMode === 'table'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                >
                    Table
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
            />

            {isLoading && (
                <div className="text-center text-gray-700 dark:text-gray-300 mb-2">
                    Loading data...
                </div>
            )}

            <div ref={chartContainerRef} className="w-full">
                {renderView()}
            </div>
        </div>
    );
};

export default HistoricalChart;
