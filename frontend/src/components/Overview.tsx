import { SensorReading } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTranslation } from 'react-i18next';
import { useSensorParams } from './context/ParamContext';
import { useMemo } from 'react';

interface OverviewProps {
  isFetching: boolean;
  refetch: () => void;
  mappings: Record<string, string>;
  data: SensorReading[] | undefined;
}

interface MergedReading {
  n: string;
  device?: string;
  ts: string;
  values: {
    tmp?: { value: number; ts: string };
    hum?: { value: number; ts: string };
    bat?: { value: number; ts: string };
    pow?: { value: number; ts: string };
    operating?: { value: number; ts: string };
  };
}

// Merge readings by sensor identifier
const mergeReadings = (readings: SensorReading[]): MergedReading[] => {
  const sensorMap = new Map<string, SensorReading[]>();

  // Group readings by sensor ID
  readings.forEach(reading => {
    const key = reading.n;
    if (!sensorMap.has(key)) {
      sensorMap.set(key, []);
    }
    sensorMap.get(key)!.push(reading);
  });

  // Process each sensor's readings
  const merged: MergedReading[] = [];

  sensorMap.forEach((sensorReadings, sensorId) => {
    // Sort by timestamp desc (newest first)
    sensorReadings.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

    const latestTs = sensorReadings[0].ts;
    const mergedReading: MergedReading = {
      n: sensorId,
      device: sensorReadings[0].device,
      ts: latestTs,
      values: {}
    };

    // Track current value for each field
    type FieldKey = 'tmp' | 'hum' | 'bat' | 'pow' | 'operating';
    const fields: FieldKey[] = ['tmp', 'hum', 'bat', 'pow', 'operating'];

    // Process readings from newest to oldest
    sensorReadings.forEach((reading, index) => {
      fields.forEach(field => {
        const newValue = reading.r?.[field];

        if (index === 0) {
          // First reading (newest)
          if (newValue !== undefined) {
            mergedReading.values[field] = { value: newValue, ts: reading.ts };
          }
        } else {
          // Subsequent readings - fill in missing values
          if (newValue !== undefined && mergedReading.values[field] === undefined) {
            mergedReading.values[field] = { value: newValue, ts: reading.ts };
          }
        }
      });
    });

    merged.push(mergedReading);
  });

  return merged;
};

const getTemperatureColor = (temp?: number) => {
  if (!temp) return 'bg-gray-100 dark:bg-gray-800';
  if (temp < 18) return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
  if (temp > 25) return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
};

const getHumidityColor = (humidity?: number) => {
  if (!humidity) return 'bg-gray-100 dark:bg-gray-800';
  if (humidity < 30) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
  if (humidity > 60) return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
  return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
};

const getBatteryColor = (battery?: number) => {
  if (!battery) return 'bg-gray-100 dark:bg-gray-800';
  if (battery < 20) return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  if (battery < 50) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
  return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
};

const StatBox = ({
  label,
  value,
  unit,
  colorClass,
  timestamp,
}: {
  label: string;
  value: string | number;
  unit: string;
  colorClass: string;
  timestamp?: string;
}) => (
  <div className={`p-4 rounded-lg ${colorClass}`}>
    <div className="text-3xl font-bold mb-1 dark:text-gray-50 dark:font-semibold">
      {value}
      {unit}
    </div>
    <div className="text-sm opacity-70 dark:opacity-50 dark:text-gray-50 dark:font-semibold">
      {label}
    </div>
    {timestamp && (
      <div className="text-xs opacity-60 dark:opacity-40 dark:text-gray-50 mt-1">
        {new Date(timestamp).toLocaleTimeString()}
      </div>
    )}
  </div>
);

const Overview = ({ isFetching, data, mappings, refetch }: OverviewProps) => {
  const { t } = useTranslation();
  const { latestValuesCount, setLatestValuesCount } = useSensorParams();

  // Merge readings by sensor identifier
  const mergedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return mergeReadings(data);
  }, [data]);

  // Check if there are multiple devices
  const hasMultipleDevices = useMemo(() => {
    const devices = new Set(mergedData.map(sensor => sensor.device).filter(Boolean));
    return devices.size > 1;
  }, [mergedData]);

  return (
    <div className="p-4 space-y-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('DASHBOARD.TITLE')}</h1>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors disabled:opacity-60"
        >
          {isFetching ? t('DASHBOARD.FETCHING') : t('DASHBOARD.REFRESH')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mergedData.map((sensor) => {
          const mappedName = mappings[sensor.n] || sensor.n;
          const date = new Date(sensor.ts);
          const formattedTime = date.toLocaleTimeString();

          return (
            <Card key={sensor.n} className="overflow-hidden dark:border-gray-700">
              <CardHeader>
                <CardTitle>
                  {mappedName}
                  {hasMultipleDevices && sensor.device && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-normal mt-1">
                      {t('DASHBOARD.DEVICE')}: {sensor.device}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <StatBox
                    label={t('DASHBOARD.TEMPERATURE')}
                    value={sensor.values.tmp?.value.toFixed(1) ?? '?'}
                    unit="°C"
                    colorClass={getTemperatureColor(sensor.values.tmp?.value)}
                    timestamp={sensor.values.tmp?.ts !== sensor.ts ? sensor.values.tmp?.ts : undefined}
                  />
                  <StatBox
                    label={t('DASHBOARD.HUMIDITY')}
                    value={sensor.values.hum?.value.toFixed(1) ?? '?'}
                    unit="%"
                    colorClass={getHumidityColor(sensor.values.hum?.value)}
                    timestamp={sensor.values.hum?.ts !== sensor.ts ? sensor.values.hum?.ts : undefined}
                  />
                  <StatBox
                    label={t('DASHBOARD.BATTERY')}
                    value={sensor.values.bat?.value ?? '?'}
                    unit="%"
                    colorClass={getBatteryColor(sensor.values.bat?.value)}
                    timestamp={sensor.values.bat?.ts !== sensor.ts ? sensor.values.bat?.ts : undefined}
                  />
                  <StatBox
                    label={t('DASHBOARD.POWER')}
                    value={sensor.values.pow?.value.toFixed(3) ?? '?'}
                    unit="V"
                    colorClass="bg-gray-100 dark:bg-gray-800"
                    timestamp={sensor.values.pow?.ts !== sensor.ts ? sensor.values.pow?.ts : undefined}
                  />
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  {t('DASHBOARD.LAST_UPDATED')} {formattedTime}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <label htmlFor="latestValuesCount" className="block text-sm font-medium mb-2">
          {t('DASHBOARD.LATEST_VALUES_COUNT')}
        </label>
        <select
          id="latestValuesCount"
          value={latestValuesCount}
          onChange={(e) => setLatestValuesCount(Number(e.target.value))}
          className="block w-full md:w-48 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export { Overview };
