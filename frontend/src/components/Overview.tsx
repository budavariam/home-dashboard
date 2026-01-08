import { SensorReading } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useTranslation } from 'react-i18next';
import { useSensorParams } from './context/ParamContext';

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
}: {
  label: string;
  value: string | number;
  unit: string;
  colorClass: string;
}) => (
  <div className={`p-4 rounded-lg ${colorClass}`}>
    <div className="text-3xl font-bold mb-1 dark:text-gray-50 dark:font-semibold">
      {value}
      {unit}
    </div>
    <div className="text-sm opacity-70 dark:opacity-50 dark:text-gray-50 dark:font-semibold">
      {label}
    </div>
  </div>
);

const Overview = ({ isFetching, data, mappings, refetch }: OverviewProps) => {
  const { t } = useTranslation();
  const { latestValuesCount, setLatestValuesCount } = useSensorParams();

  // Check if there are multiple devices
  const devices = new Set(data?.map(sensor => sensor.device).filter(Boolean));
  const hasMultipleDevices = devices.size > 1;

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
        {data?.map((sensor, index) => {
          const mappedName = mappings[sensor.n] || sensor.n;
          const date = new Date(sensor.ts);
          const formattedTime = date.toLocaleTimeString();

          return (
            <Card key={`${sensor.n}-${index}`} className="overflow-hidden dark:border-gray-700">
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
                    value={sensor.r?.tmp?.toFixed(1) ?? '?'}
                    unit="°C"
                    colorClass={getTemperatureColor(sensor.r?.tmp)}
                  />
                  <StatBox
                    label={t('DASHBOARD.HUMIDITY')}
                    value={sensor.r?.hum?.toFixed(1) ?? '?'}
                    unit="%"
                    colorClass={getHumidityColor(sensor.r?.hum)}
                  />
                  <StatBox
                    label={t('DASHBOARD.BATTERY')}
                    value={sensor.r?.bat ?? '?'}
                    unit="%"
                    colorClass={getBatteryColor(sensor.r?.bat)}
                  />
                  <StatBox
                    label={t('DASHBOARD.POWER')}
                    value={sensor.r?.pow?.toFixed(3) ?? '?'}
                    unit="V"
                    colorClass="bg-gray-100 dark:bg-gray-800"
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
