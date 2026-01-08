import { SensorReading } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTranslation } from 'react-i18next';
import { useSensorParams } from './context/ParamContext';
import { useMemo, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

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

const getTemperatureColor = (temp: number | undefined, cold: number, hot: number) => {
  if (!temp) return 'bg-gray-100 dark:bg-gray-800';
  if (temp < cold) return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
  if (temp > hot) return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
};

const getHumidityColor = (humidity: number | undefined, low: number, high: number) => {
  if (!humidity) return 'bg-gray-100 dark:bg-gray-800';
  if (humidity < low) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
  if (humidity > high) return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
  return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
};

const getBatteryColor = (battery: number | undefined, lowThreshold: number, mediumThreshold: number) => {
  if (!battery) return 'bg-gray-100 dark:bg-gray-800';
  if (battery < lowThreshold) return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  if (battery < mediumThreshold) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
  return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
};

const getVoltageColor = (voltage: number | undefined, lowThreshold: number, mediumThreshold: number) => {
  if (!voltage) return 'bg-gray-100 dark:bg-gray-800';
  if (voltage < lowThreshold) return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  if (voltage < mediumThreshold) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
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
  const { latestValuesCount, setLatestValuesCount, colorThresholds, setColorThresholds } = useSensorParams();
  const [isThresholdsOpen, setIsThresholdsOpen] = useState(false);

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
                <CardTitle className="break-words">
                  {mappedName}
                  {hasMultipleDevices && sensor.device && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-normal mt-1 break-words">
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
                    colorClass={getTemperatureColor(sensor.values.tmp?.value, colorThresholds.temperature.cold, colorThresholds.temperature.hot)}
                    timestamp={sensor.values.tmp?.ts !== sensor.ts ? sensor.values.tmp?.ts : undefined}
                  />
                  <StatBox
                    label={t('DASHBOARD.HUMIDITY')}
                    value={sensor.values.hum?.value.toFixed(1) ?? '?'}
                    unit="%"
                    colorClass={getHumidityColor(sensor.values.hum?.value, colorThresholds.humidity.low, colorThresholds.humidity.high)}
                    timestamp={sensor.values.hum?.ts !== sensor.ts ? sensor.values.hum?.ts : undefined}
                  />
                  <StatBox
                    label={t('DASHBOARD.BATTERY')}
                    value={sensor.values.bat?.value ?? '?'}
                    unit="%"
                    colorClass={getBatteryColor(sensor.values.bat?.value, colorThresholds.battery.low, colorThresholds.battery.medium)}
                    timestamp={sensor.values.bat?.ts !== sensor.ts ? sensor.values.bat?.ts : undefined}
                  />
                  <StatBox
                    label={t('DASHBOARD.POWER')}
                    value={sensor.values.pow?.value.toFixed(3) ?? '?'}
                    unit="V"
                    colorClass={getVoltageColor(sensor.values.pow?.value, colorThresholds.voltage.low, colorThresholds.voltage.medium)}
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

      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Collapsible open={isThresholdsOpen} onOpenChange={setIsThresholdsOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium mb-2">
            <span>{t('DASHBOARD.COLOR_THRESHOLDS')}</span>
            <span className="text-xs">{isThresholdsOpen ? '▲' : '▼'}</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-4 mt-4">
              {/* Temperature Thresholds */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                <h3 className="font-medium text-sm mb-3">{t('DASHBOARD.TEMPERATURE')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="temp-cold" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('DASHBOARD.THRESHOLD_COLD')} (&lt;)
                    </label>
                    <input
                      type="number"
                      id="temp-cold"
                      value={colorThresholds.temperature.cold}
                      onChange={(e) => setColorThresholds({
                        ...colorThresholds,
                        temperature: { ...colorThresholds.temperature, cold: Number(e.target.value) }
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="temp-hot" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('DASHBOARD.THRESHOLD_HOT')} (&gt;)
                    </label>
                    <input
                      type="number"
                      id="temp-hot"
                      value={colorThresholds.temperature.hot}
                      onChange={(e) => setColorThresholds({
                        ...colorThresholds,
                        temperature: { ...colorThresholds.temperature, hot: Number(e.target.value) }
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Humidity Thresholds */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                <h3 className="font-medium text-sm mb-3">{t('DASHBOARD.HUMIDITY')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hum-low" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('DASHBOARD.THRESHOLD_LOW')} (&lt;)
                    </label>
                    <input
                      type="number"
                      id="hum-low"
                      value={colorThresholds.humidity.low}
                      onChange={(e) => setColorThresholds({
                        ...colorThresholds,
                        humidity: { ...colorThresholds.humidity, low: Number(e.target.value) }
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="hum-high" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('DASHBOARD.THRESHOLD_HIGH')} (&gt;)
                    </label>
                    <input
                      type="number"
                      id="hum-high"
                      value={colorThresholds.humidity.high}
                      onChange={(e) => setColorThresholds({
                        ...colorThresholds,
                        humidity: { ...colorThresholds.humidity, high: Number(e.target.value) }
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Battery Thresholds */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                <h3 className="font-medium text-sm mb-3">{t('DASHBOARD.BATTERY')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="bat-low" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('DASHBOARD.THRESHOLD_LOW')} (&lt;)
                    </label>
                    <input
                      type="number"
                      id="bat-low"
                      value={colorThresholds.battery.low}
                      onChange={(e) => setColorThresholds({
                        ...colorThresholds,
                        battery: { ...colorThresholds.battery, low: Number(e.target.value) }
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="bat-medium" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('DASHBOARD.THRESHOLD_MEDIUM')} (&lt;)
                    </label>
                    <input
                      type="number"
                      id="bat-medium"
                      value={colorThresholds.battery.medium}
                      onChange={(e) => setColorThresholds({
                        ...colorThresholds,
                        battery: { ...colorThresholds.battery, medium: Number(e.target.value) }
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Voltage Thresholds */}
              <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                <h3 className="font-medium text-sm mb-3">{t('DASHBOARD.POWER')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="volt-low" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('DASHBOARD.THRESHOLD_LOW')} (&lt;)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="volt-low"
                      value={colorThresholds.voltage.low}
                      onChange={(e) => setColorThresholds({
                        ...colorThresholds,
                        voltage: { ...colorThresholds.voltage, low: Number(e.target.value) }
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="volt-medium" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {t('DASHBOARD.THRESHOLD_MEDIUM')} (&lt;)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      id="volt-medium"
                      value={colorThresholds.voltage.medium}
                      onChange={(e) => setColorThresholds({
                        ...colorThresholds,
                        voltage: { ...colorThresholds.voltage, medium: Number(e.target.value) }
                      })}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export { Overview };
