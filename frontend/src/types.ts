export interface SensorReading {
    n: string;  // sensor name
    r: {
        bat: number;  // battery
        hum: number;  // humidity
        operating: number;
        pow: number;  // power
        tmp: number;  // temperature
    };
    ts: string;  // timestamp
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
    ts: "2025-01-01"
})

export interface ApiParams {
    user: string | null;
    bucket: string | null;
}
