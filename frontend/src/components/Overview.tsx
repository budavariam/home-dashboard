import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SensorReading {
  n: string;
  ts: number;
  r?: {
    tmp?: number;
    hum?: number;
    bat?: number;
    pow?: number;
  };
}

interface OverviewProps {
  isFetching: boolean;
  refetch: () => void;
  mappings: Record<string, string>;
  data: SensorReading[] | undefined;
}

const getTemperatureColor = (temp?: number) => {
  if (!temp) return 'bg-gray-100 dark:bg-gray-800';
  if (temp < 18) return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
  if (temp > 25) return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'; // Comfortable range 18-25°C
};

const getHumidityColor = (humidity?: number) => {
  if (!humidity) return 'bg-gray-100 dark:bg-gray-800';
  if (humidity < 30) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
  if (humidity > 60) return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
  return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'; // Comfortable range 30-60%
};

const getBatteryColor = (battery?: number) => {
  if (!battery) return 'bg-gray-100 dark:bg-gray-800';
  if (battery < 20) return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  if (battery < 50) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
  return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
};

const StatBox = ({ label, value, unit, colorClass }: { 
  label: string;
  value: string | number;
  unit: string;
  colorClass: string;
}) => (
  <div className={`p-4 rounded-lg ${colorClass}`}>
    <div className="text-3xl font-bold mb-1 dark:text-gray-50 dark:font-semibold">{value}{unit}</div>
    <div className="text-sm opacity-70 dark:opacity-50 dark:text-gray-50 dark:font-semibold">{label}</div>
  </div>
);

const Overview = ({ isFetching, data, mappings, refetch }: OverviewProps) => {
  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sensor Dashboard</h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
        >
          Refresh Now
        </button>
      </div>

      {isFetching && (
        <div className="text-gray-500 dark:text-gray-400 text-center py-4">
          Fetching data...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.map((sensor) => {
          const mappedName = mappings[sensor.n] || sensor.n;
          const date = new Date(sensor.ts);
          const formattedTime = date.toLocaleTimeString();

          return (
            <Card key={sensor.n} className="overflow-hidden dark:border-gray-700">
              <CardHeader>
                <CardTitle>{mappedName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <StatBox
                    label="Temperature"
                    value={sensor.r?.tmp?.toFixed(1) ?? "?"}
                    unit="°C"
                    colorClass={getTemperatureColor(sensor.r?.tmp)}
                  />
                  <StatBox
                    label="Humidity"
                    value={sensor.r?.hum?.toFixed(1) ?? "?"}
                    unit="%"
                    colorClass={getHumidityColor(sensor.r?.hum)}
                  />
                  <StatBox
                    label="Battery"
                    value={sensor.r?.bat ?? "?"}
                    unit="%"
                    colorClass={getBatteryColor(sensor.r?.bat)}
                  />
                  <StatBox
                    label="Power"
                    value={sensor.r?.pow?.toFixed(3) ?? "?"}
                    unit="V"
                    colorClass="bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Last updated: {formattedTime}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export { Overview };