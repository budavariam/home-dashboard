import React, { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
} from "chart.js";
import { useHistoricalData } from "../hooks/useHistoricalData";
import { useSensorParams } from "./context/ParamContext";
import { TimeRange } from "@/types";
import { QueryError } from "./QueryError";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type MetricKey = "hum" | "tmp" | "bat";
type MetricLabel = "Humidity" | "Temperature" | "Battery";

interface MetricConfig {
    key: MetricKey;
    label: MetricLabel;
    borderDash?: number[];
}

const METRICS: MetricConfig[] = [
    { key: "hum", label: "Humidity" },
    { key: "tmp", label: "Temperature", borderDash: [5, 5] },
    { key: "bat", label: "Battery", borderDash: [2, 2] },
];

const TIME_RANGES = [
    { value: "1h", label: "Last 1 Hour" },
    { value: "6h", label: "Last 6 Hours" },
    { value: "12h", label: "Last 12 Hours" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "48h", label: "Last 2 Days" },
    { value: "1w", label: "Last Week" },
    { value: "2w", label: "Past 2 Weeks" },
] as const;

const COLORS = ["#3b82f6", "#f97316", "#10b981", "#eab308", "#8b5cf6"];

const formatTimestamp = (ts: number, timeRange: TimeRange) => {
    const date = new Date(ts);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;

    if (["48h", "1w", "2w"].includes(timeRange)) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}.${day} ${timeStr}`;
    }
    return timeStr;
};

const HistoricalChart: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>("6h");
    const [selectedMetrics, setSelectedMetrics] = useState<Record<MetricKey, boolean>>({
        hum: true,
        tmp: true,
        bat: false,
    });
    const [chartConfig, setChartConfig] = useState({
        showLegend: true,
        showAxisLabels: true,
        splitCharts: true,
    });
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, isError, error, refetch } = useHistoricalData(timeRange);
    const { mappings } = useSensorParams();

    const groupedData = React.useMemo(() => {
        const readings = data?.map((entry) => {
            const r = entry.val.readings
            r.sort((a, b) => -1 * a.n.localeCompare(b.n))
            return r
        }).flat() || [];

        const allTimestamps = new Set<number>();
        readings.forEach(reading => {
            if (reading?.ts) allTimestamps.add(+new Date(reading.ts));
        });
        const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b);
        const formattedTimestamps = sortedTimestamps.map(ts => formatTimestamp(ts, timeRange));
        const result: Record<string, Record<MetricKey, (number | null)[]> & { timestamps: string[] }> = {};

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
    }, [data, timeRange]);

    useEffect(() => {
        // console.log(selectedDevices.length);
        setSelectedDevices(Object.keys(groupedData));
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

    if (isError) return <QueryError error={error} refetch={refetch} />;

    const colorMap: Record<string, string> = Object.keys(groupedData).reduce((acc, device, index) => ({
        ...acc,
        [device]: COLORS[index % COLORS.length],
    }), {});

    const createDatasets = (metricKey: MetricKey) => {
        const metric = METRICS.find(m => m.key === metricKey)!;
        return Object.entries(groupedData)
            .filter(([device]) => selectedDevices.includes(device))
            .map(([device, data]) => ({
                label: `${mappings[device] || device} - ${metric.label}`,
                data: data[metricKey],
                borderColor: colorMap[device],
                backgroundColor: `${colorMap[device]}80`,
                tension: 0.4,
                borderDash: metric.borderDash,
                spanGaps: true,
                pointRadius: 2,
                pointHoverRadius: 4,
            }));
    };

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: chartConfig.showLegend,
                position: "bottom",
                labels: { color: "#9CA3AF" },
            },
            title: {
                display: true,
                text: "Historical Device Readings",
                color: "#9CA3AF",
            },
        },
        scales: {
            x: {
                ticks: {
                    display: chartConfig.showAxisLabels,
                    color: "#9CA3AF",
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: true,
                    maxTicksLimit: 15,
                },
                grid: { color: "#4B5563" },
            },
            y: {
                ticks: {
                    display: chartConfig.showAxisLabels,
                    color: "#9CA3AF",
                },
                grid: { color: "#4B5563" },
                beginAtZero: true,
            },
        },
    };

    const renderChart = (metricKey?: MetricKey) => {
        const datasets = metricKey
            ? createDatasets(metricKey)
            : METRICS.filter(m => selectedMetrics[m.key]).flatMap(m => createDatasets(m.key));

        const options = metricKey
            ? {
                ...chartOptions,
                plugins: {
                    ...chartOptions.plugins,
                    title: {
                        ...chartOptions.plugins?.title,
                        text: `${METRICS.find(m => m.key === metricKey)?.label} Chart`,
                    },
                },
            }
            : chartOptions;

        return (
            <Line
                options={options}
                data={{
                    labels: Object.values(groupedData)[0]?.timestamps || [],
                    datasets,
                }}
            />
        );
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded shadow-lg">
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        className="border rounded p-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                    >
                        {TIME_RANGES.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>

                    <div className="flex gap-2 items-center">
                        {METRICS.map(({ key, label }) => (
                            <label key={key} className="text-gray-700 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={selectedMetrics[key]}
                                    onChange={(e) => setSelectedMetrics(prev => ({
                                        ...prev,
                                        [key]: e.target.checked,
                                    }))}
                                />
                                {label}
                            </label>
                        ))}
                    </div>

                    <div className="flex gap-2 items-center">
                        {Object.entries({
                            showLegend: "Legends",
                            showAxisLabels: "Axis Labels",
                            splitCharts: "Split Charts",
                        }).map(([key, label]) => (
                            <label key={key} className="text-gray-700 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={chartConfig[key as keyof typeof chartConfig]}
                                    onChange={(e) => setChartConfig(prev => ({
                                        ...prev,
                                        [key]: e.target.checked,
                                    }))}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Devices</span>
                            <span>
                                <button
                                    onClick={() => setSelectedDevices(Object.keys(groupedData))}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline mr-2"
                                >
                                    Select All
                                </button>
                                <button
                                    onClick={() => setSelectedDevices([])}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Deselect All
                                </button>
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {Object.keys(groupedData).map((device) => (
                                <label
                                    key={device}
                                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedDevices.includes(device)}
                                        onChange={(e) => {
                                            setSelectedDevices(prev =>
                                                e.target.checked
                                                    ? [...prev, device]
                                                    : prev.filter(d => d !== device)
                                            );
                                        }}
                                        className="rounded border-gray-300"
                                    />
                                    <span style={{ color: colorMap[device] }}>
                                        {mappings[device] || device}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="text-center text-gray-700 dark:text-gray-300 mb-2">
                    Loading data...
                </div>
            )}

            <div ref={chartContainerRef} className="w-full">
                {chartConfig.splitCharts ? (
                    METRICS
                        .filter(({ key }) => selectedMetrics[key])
                        .map(({ key }) => (
                            <div key={key} className="mb-6 h-[400px]">
                                {renderChart(key)}
                            </div>
                        ))
                ) : (
                    <div className="h-[400px]">
                        {renderChart()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoricalChart;