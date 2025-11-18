export interface SensorReading {
    n: string;  // sensor name
    r: {
        bat?: number;  // battery
        hum?: number;  // humidity
        operating?: number;
        pow?: number;  // power
        tmp?: number;  // temperature
    };
    ts: number | string;  // timestamp
}

export const DEFAULT_VALUE: SensorReading = Object.freeze({
    n: "Name",
    r: {
        bat: 0,
        hum: 0,
        operating: 0,
        pow: 0,
        tmp: 0,
    },
    ts: 0
})

export interface ApiParams {
    user: string | null;
    bucket: string | null;
}

export interface ApiResponse {
    val: {
        readings: SensorReading[];
    };
    ts?: number;
}

export type TimeRange = "1h" | "6h" | "12h" | "24h" | "48h" | "1w" | "2w" | "1m";
export type MetricKey = "hum" | "tmp" | "bat";
export type MetricLabel = "Humidity" | "Temperature" | "Battery";

export interface MetricConfig {
    key: MetricKey;
    label: MetricLabel;
    borderDash?: number[];
}

export interface ChartConfig {
    showLegend: boolean;
    showAxisLabels: boolean;
    splitCharts: boolean;
    enableExtrapolation?: boolean;
    forecastMethod?: 'linear' | 'exponential' | 'moving-average';
    forecastPoints?: number;
    forecastWindowSize?: number;
}

export interface DeviceData {
    hum: (number | null)[];
    tmp: (number | null)[];
    bat: (number | null)[];
    timestamps: string[];
}

export interface GroupedData {
    [deviceName: string]: DeviceData;
}