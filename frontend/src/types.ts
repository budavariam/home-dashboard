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

export type TimeRange = "1h" | "6h" | "12h" | "24h" | "48h" | "1w" | "2w";