import { MetricKey, GroupedData, DeviceData } from '../types';
import { formatTimestamp } from './time';

export interface ExtrapolationConfig {
    enabled: boolean;
    method: 'linear' | 'exponential' | 'moving-average';
    points: number; // Number of future points to extrapolate
    windowSize?: number; // For moving average and data analysis
}

export interface ExtrapolationResult {
    timestamps: string[];
    values: Record<string, Record<MetricKey, (number | null)[]>>;
    isExtrapolated: boolean[];
}

/**
 * Linear regression for time series data
 * Uses least squares method to fit a line through recent data points
 */
function linearRegression(data: number[], startIndex: number = 0): { slope: number; intercept: number } {
    const n = data.length;
    if (n < 2) return { slope: 0, intercept: data[0] || 0 };

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
        const x = startIndex + i;
        const y = data[i];
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

/**
 * Exponential smoothing for time series forecasting
 * Gives more weight to recent observations
 */
function exponentialSmoothing(data: number[], alpha: number = 0.3): number[] {
    if (data.length === 0) return [];
    
    const smoothed: number[] = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
        smoothed[i] = alpha * data[i] + (1 - alpha) * smoothed[i - 1];
    }
    
    return smoothed;
}

/**
 * Moving average calculation
 */
function movingAverage(data: number[], windowSize: number): number[] {
    const result: number[] = [];
    
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const window = data.slice(start, i + 1);
        const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
        result.push(avg);
    }
    
    return result;
}

/**
 * Extract non-null values from the end of a data series
 */
function getRecentValidData(data: (number | null)[], windowSize: number): number[] {
    const validData: number[] = [];
    
    for (let i = data.length - 1; i >= 0 && validData.length < windowSize; i--) {
        if (data[i] !== null) {
            validData.unshift(data[i] as number);
        }
    }
    
    return validData;
}

/**
 * Extrapolate future timestamps
 */
function extrapolateTimestamps(
    existingTimestamps: string[],
    points: number
): string[] {
    if (existingTimestamps.length < 2) {
        // Fallback: just add sequential numbers
        return Array.from({ length: points }, (_, i) => `Future ${i + 1}`);
    }

    // Try to parse timestamps and detect interval
    const lastTwo = existingTimestamps.slice(-2);
    
    // Try ISO date format
    const date1 = new Date(lastTwo[0]);
    const date2 = new Date(lastTwo[1]);
    
    if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
        const interval = date2.getTime() - date1.getTime();
        const newTimestamps: string[] = [];
        
        for (let i = 1; i <= points; i++) {
            const newDate = new Date(date2.getTime() + interval * i);
            newTimestamps.push(formatTimestamp(+newDate));
        }
        
        return newTimestamps;
    }
    
    // Try HH:MM format
    const timeRegex = /^(\d{2}):(\d{2})$/;
    const match1 = lastTwo[0].match(timeRegex);
    const match2 = lastTwo[1].match(timeRegex);
    
    if (match1 && match2) {
        const minutes1 = parseInt(match1[1]) * 60 + parseInt(match1[2]);
        const minutes2 = parseInt(match2[1]) * 60 + parseInt(match2[2]);
        const interval = minutes2 - minutes1;
        
        const newTimestamps: string[] = [];
        for (let i = 1; i <= points; i++) {
            const totalMinutes = (minutes2 + interval * i) % (24 * 60);
            const hours = Math.floor(totalMinutes / 60);
            const mins = totalMinutes % 60;
            newTimestamps.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
        }
        
        return newTimestamps;
    }
    
    // Fallback
    return Array.from({ length: points }, (_, i) => `+${i + 1}`);
}

/**
 * Extrapolate values using linear regression
 */
function extrapolateLinear(data: number[], points: number, startIndex: number): number[] {
    const { slope, intercept } = linearRegression(data, startIndex);
    const result: number[] = [];
    
    for (let i = 1; i <= points; i++) {
        const x = startIndex + data.length + i - 1;
        result.push(intercept + slope * x);
    }
    
    return result;
}

/**
 * Extrapolate values using exponential smoothing
 */
function extrapolateExponential(data: number[], points: number, alpha: number = 0.3): number[] {
    const smoothed = exponentialSmoothing(data, alpha);
    const lastValue = smoothed[smoothed.length - 1];
    const trend = smoothed[smoothed.length - 1] - smoothed[smoothed.length - 2];
    
    const result: number[] = [];
    for (let i = 1; i <= points; i++) {
        result.push(lastValue + trend * i);
    }
    
    return result;
}

/**
 * Extrapolate values using moving average
 */
function extrapolateMovingAverage(data: number[], points: number, windowSize: number): number[] {
    const ma = movingAverage(data, windowSize);
    const lastValue = ma[ma.length - 1];
    
    // Simple trend from last few moving average values
    const trendWindow = Math.min(3, ma.length);
    const recentMA = ma.slice(-trendWindow);
    const trend = (recentMA[recentMA.length - 1] - recentMA[0]) / (trendWindow - 1);
    
    const result: number[] = [];
    for (let i = 1; i <= points; i++) {
        result.push(lastValue + trend * i);
    }
    
    return result;
}

/**
 * Main extrapolation function
 * Extends grouped data with extrapolated future values
 */
export function extrapolateGroupedData(
    groupedData: GroupedData,
    config: ExtrapolationConfig
): GroupedData {
    if (!config.enabled || config.points <= 0) {
        return groupedData;
    }

    const windowSize = config.windowSize || Math.min(10, Math.floor(Object.values(groupedData)[0]?.timestamps.length / 2) || 5);
    const devices = Object.keys(groupedData);
    const existingTimestamps = Object.values(groupedData)[0]?.timestamps || [];
    
    if (existingTimestamps.length === 0) {
        return groupedData;
    }

    // Generate future timestamps
    const futureTimestamps = extrapolateTimestamps(existingTimestamps, config.points);
    const allTimestamps = [...existingTimestamps, ...futureTimestamps];

    const extrapolatedData: GroupedData = {};

    devices.forEach(device => {
        const deviceData = groupedData[device];
        const extrapolatedDevice: DeviceData = {
            timestamps: allTimestamps,
            hum: [],
            tmp: [],
            bat: [],
        };

        (['hum', 'tmp', 'bat'] as MetricKey[]).forEach(metric => {
            const existingValues = deviceData[metric];
            const recentData = getRecentValidData(existingValues, windowSize);
            
            if (recentData.length < 2) {
                // Not enough data, just use last value
                const lastValue = recentData[0] || null;
                extrapolatedDevice[metric] = [
                    ...existingValues,
                    ...Array(config.points).fill(lastValue),
                ];
                return;
            }

            let futureValues: number[] = [];
            const startIndex = existingValues.length - recentData.length;

            switch (config.method) {
                case 'linear':
                    futureValues = extrapolateLinear(recentData, config.points, startIndex);
                    break;
                case 'exponential':
                    futureValues = extrapolateExponential(recentData, config.points);
                    break;
                case 'moving-average':
                    futureValues = extrapolateMovingAverage(recentData, config.points, windowSize);
                    break;
                default:
                    futureValues = extrapolateLinear(recentData, config.points, startIndex);
            }

            extrapolatedDevice[metric] = [...existingValues, ...futureValues];
        });

        extrapolatedData[device] = extrapolatedDevice;
    });

    return extrapolatedData;
}

/**
 * Helper to determine which data points are extrapolated
 */
export function getExtrapolationMarkers(
    originalLength: number,
    totalLength: number
): boolean[] {
    return Array.from({ length: totalLength }, (_, i) => i >= originalLength);
}

/**
 * Calculate confidence/quality score for extrapolation based on data characteristics
 */
export function calculateExtrapolationConfidence(
    data: (number | null)[],
    windowSize: number
): number {
    const recentData = getRecentValidData(data, windowSize);
    
    if (recentData.length < 2) return 0;

    // Calculate variance
    const mean = recentData.reduce((sum, val) => sum + val, 0) / recentData.length;
    const variance = recentData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recentData.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower variance = higher confidence
    const coefficientOfVariation = stdDev / Math.abs(mean);
    
    // Scale to 0-1, where lower CV = higher confidence
    return Math.max(0, Math.min(1, 1 - coefficientOfVariation));
}
