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

interface SelectedValues {
    hum: boolean;
    tmp: boolean;
    bat: boolean;
}

interface GroupedData {
    [key: string]: {
        hum: number[];
        tmp: number[];
        bat: number[];
        timestamps: string[];
    };
}

const HistoricalChart: React.FC = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>("6h");
    const [selectedValues, setSelectedValues] = useState<SelectedValues>({
        hum: true,
        tmp: true,
        bat: false,
    });
    const [showLegend, setShowLegend] = useState(true);
    const [showAxisLabels, setShowAxisLabels] = useState(true);
    const [splitCharts, setSplitCharts] = useState(true);
    const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, isError, error, refetch } = useHistoricalData(timeRange);
    const { mappings } = useSensorParams();

    const readings = data?.map((entry) => entry.val.readings).flat() || [];
    const groupedData = readings.reduce<GroupedData>((acc, reading) => {
        const n = reading?.n ?? null;
        if (!n) return acc;
        const r = reading?.r ?? { hum: -1, tmp: -1, bat: -1 };
        const ts = reading?.ts ?? Date.now();
        if (!acc[n]) acc[n] = { hum: [], tmp: [], bat: [], timestamps: [] };
        if ([r.hum, r.tmp, r.bat].some((v) => v === undefined)) {
            return acc;
        }
        acc[n].hum.push(r?.hum ?? -1);
        acc[n].tmp.push(r?.tmp ?? -1);
        acc[n].bat.push(r?.bat ?? -1);
        acc[n].timestamps.push(new Date(ts).toLocaleTimeString());
        return acc;
    }, {});

    // Initialize selected devices with all devices if empty
    useEffect(() => {
        if (selectedDevices.length === 0 && Object.keys(groupedData).length > 0) {
            setSelectedDevices(Object.keys(groupedData));
        }
    }, [groupedData]);

    // Add resize observer to handle container size changes
    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            const charts = container.getElementsByTagName('canvas');
            Array.from(charts).forEach(chart => {
                const chartInstance = ChartJS.getChart(chart);
                if (chartInstance) {
                    chartInstance.resize();
                }
            });
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    if (isError) {
        return <QueryError error={error} refetch={refetch} />;
    }

    const colors = ["#3b82f6", "#f97316", "#10b981", "#eab308", "#8b5cf6"];
    const colorMap = Object.keys(groupedData).reduce<Record<string, string>>((acc, device, index) => {
        acc[device] = colors[index % colors.length];
        return acc;
    }, {});

    const createDatasets = (key: "hum" | "tmp" | "bat") =>
        Object.entries(groupedData)
            .filter(([device]) => selectedDevices.includes(device))
            .map(([device, data]) => ({
                label: `${mappings[device] || device} - ${key === "hum" ? "Humidity" : key === "tmp" ? "Temperature" : "Battery"}`,
                data: data[key],
                borderColor: colorMap[device],
                backgroundColor: `${colorMap[device]}80`,
                tension: 0.4,
                borderDash: key === "tmp" ? [5, 5] : key === "bat" ? [2, 2] : undefined,
            }));

    const handleSelectAllDevices = () => {
        setSelectedDevices(Object.keys(groupedData));
    };

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: showLegend,
                position: "bottom" as const,
                labels: {
                    color: "#9CA3AF",
                },
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
                    display: showAxisLabels,
                    color: "#9CA3AF",
                },
                grid: {
                    color: "#4B5563",
                },
            },
            y: {
                ticks: {
                    display: showAxisLabels,
                    color: "#9CA3AF",
                },
                grid: {
                    color: "#4B5563",
                },
            },
        },
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
                        <option value="1h">Last 1 Hour</option>
                        <option value="6h">Last 6 Hours</option>
                        <option value="12h">Last 12 Hours</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="48h">Last 2 Days</option>
                        <option value="1w">Last Week</option>
                    </select>
                    <div className="flex gap-2 items-center">
                        <label className="text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedValues.hum}
                                onChange={(e) => setSelectedValues({ ...selectedValues, hum: e.target.checked })}
                            />
                            Humidity
                        </label>
                        <label className="text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedValues.tmp}
                                onChange={(e) => setSelectedValues({ ...selectedValues, tmp: e.target.checked })}
                            />
                            Temperature
                        </label>
                        <label className="text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={selectedValues.bat}
                                onChange={(e) => setSelectedValues({ ...selectedValues, bat: e.target.checked })}
                            />
                            Battery
                        </label>
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={showLegend}
                                onChange={(e) => setShowLegend(e.target.checked)}
                            />
                            Legends
                        </label>
                        <label className="text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={showAxisLabels}
                                onChange={(e) => setShowAxisLabels(e.target.checked)}
                            />
                            Axis Labels
                        </label>
                        <label className="text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={splitCharts}
                                onChange={(e) => setSplitCharts(e.target.checked)}
                            />
                            Split Charts
                        </label>
                    </div>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Devices</span>
                            <div className="space-x-2">
                                <button
                                    onClick={handleSelectAllDevices}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Select All
                                </button>
                            </div>
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
                                            if (e.target.checked) {
                                                setSelectedDevices([...selectedDevices, device]);
                                            } else {
                                                setSelectedDevices(selectedDevices.filter(d => d !== device));
                                            }
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

            {isLoading && <div className="text-center text-gray-700 dark:text-gray-300 mb-2">Loading data...</div>}
            <div ref={chartContainerRef} className="w-full">
                {!splitCharts ? (
                    <div className="h-[400px]">
                        <Line
                            options={chartOptions}
                            data={{
                                labels: Object.values(groupedData)[0]?.timestamps || [],
                                datasets: [
                                    ...(selectedValues.hum ? createDatasets("hum") : []),
                                    ...(selectedValues.tmp ? createDatasets("tmp") : []),
                                    ...(selectedValues.bat ? createDatasets("bat") : []),
                                ],
                            }}
                        />
                    </div>
                ) : (
                    ["hum", "tmp", "bat"]
                        .filter((key) => selectedValues[key as keyof SelectedValues])
                        .map((key) => (
                            <div key={key} className="mb-6 h-[400px]">
                                <Line
                                    options={{
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            title: {
                                                ...chartOptions?.plugins?.title,
                                                text: `${key === "hum" ? "Humidity" : key === "tmp" ? "Temperature" : "Battery"} Chart`,
                                            },
                                        },
                                    }}
                                    data={{
                                        labels: Object.values(groupedData)[0]?.timestamps || [],
                                        datasets: createDatasets(key as "hum" | "tmp" | "bat"),
                                    }}
                                />
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};

export default HistoricalChart;