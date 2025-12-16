export interface SensorReading {
    n: string;  // sensor name
    r: {
        bat?: number;  // battery
        hum?: number;  // humidity
        operating?: number;
        pow?: number;  // power
        tmp?: number;  // temperature
    };
    ts: string;  // timestamp in ISO format (e.g., "2025-12-16T12:07:17Z")
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
    ts: "1970-01-01T00:00:00.000Z"
})

export interface ApiParams {
    user: string | null;
    bucket: string | null;
}

export interface ApiResponse {
    val: {
        readings: SensorReading[];
    };
    ts: number;  // root timestamp in milliseconds since epoch
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
    compareLastPeriod?: boolean;
    autoScaleY?: boolean;
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