import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSensorParams } from '../components/context/ParamContext'
import { DeviceSelector } from '../components/DeviceSelector'
import { AnalyticsUploader } from '../components/analytics/AnalyticsUploader'
import { AnalyticsBarChart } from '../components/analytics/AnalyticsBarChart'
import {
  clearAnalyticsData,
  getAnalyticsEntryCount,
  getAnalyticsSensors,
  getAnalyticsYears,
  storeAnalyticsEntries,
  AnalyticsEntry,
} from '../lib/analyticsDb'
import { parseAnalyticsCsv, parseAnalyticsJson } from '../utils/analyticsParser'

const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation()
  const { mappings } = useSensorParams()

  const [entryCount, setEntryCount] = useState(0)
  const [years, setYears] = useState<number[]>([])
  const [sensors, setSensors] = useState<string[]>([])
  const [yearA, setYearA] = useState<number | null>(null)
  const [yearB, setYearB] = useState<number | null>(null)
  const [selectedSensors, setSelectedSensors] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const loadMetadata = async () => {
    const count = await getAnalyticsEntryCount()
    setEntryCount(count)
    if (count > 0) {
      const [y, s] = await Promise.all([getAnalyticsYears(), getAnalyticsSensors()])
      setYears(y)
      setSensors(s)
      if (yearA === null) setYearA(y[y.length - 1] ?? null)
      if (yearB === null) setYearB(y.length >= 2 ? y[y.length - 2] : null)
      if (selectedSensors.length === 0) setSelectedSensors(s)
    }
  }

  useEffect(() => {
    loadMetadata()
  }, [])

  const handleUpload = async (file: File) => {
    if (entryCount > 0) {
      if (!window.confirm(t('ANALYTICS.UPLOAD_REPLACE_CONFIRM', { total: entryCount.toLocaleString() }))) return
      await clearAnalyticsData()
      setEntryCount(0)
      setYearA(null)
      setYearB(null)
      setSelectedSensors([])
    }

    setIsUploading(true)
    try {
      const text = await file.text()
      const rows = file.name.endsWith('.json')
        ? parseAnalyticsJson(text)
        : parseAnalyticsCsv(text)

      const entries: AnalyticsEntry[] = []
      for (const row of rows) {
        const date = new Date(row.globalTs)
        if (isNaN(date.getTime())) continue
        const year = date.getUTCFullYear()
        const month = date.getUTCMonth() + 1
        const day = date.getUTCDate()
        const ts = date.getTime()
        for (const sensor of row.sensors) {
          entries.push({ ts, year, month, day, sensorName: sensor.name, tmp: sensor.tmp })
        }
      }

      await storeAnalyticsEntries(entries)
      toast.success(t('ANALYTICS.UPLOAD_SUCCESS', { total: entries.length.toLocaleString() }))
      await loadMetadata()
    } catch (e) {
      console.error(e)
      toast.error(t('ANALYTICS.UPLOAD_ERROR'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleClear = async () => {
    if (!window.confirm(t('ANALYTICS.CLEAR_CONFIRM'))) return
    await clearAnalyticsData()
    setEntryCount(0)
    setYears([])
    setSensors([])
    setYearA(null)
    setYearB(null)
    setSelectedSensors([])
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">{t('ANALYTICS.TITLE')}</h1>

      {/* How-to info */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
        <p className="font-semibold mb-2">{t('ANALYTICS.HOWTO_TITLE')}</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>{t('ANALYTICS.HOWTO_1')}</li>
          <li>{t('ANALYTICS.HOWTO_2')}</li>
          <li>{t('ANALYTICS.HOWTO_3')}</li>
          <li>{t('ANALYTICS.HOWTO_4')}</li>
        </ol>
        <p className="mt-2 text-blue-600 dark:text-blue-300">{t('ANALYTICS.HOWTO_NOTE')}</p>
      </div>

      <AnalyticsUploader
        onUpload={handleUpload}
        entryCount={entryCount}
        isLoading={isUploading}
        onClear={handleClear}
      />

      {entryCount > 0 && (
        <>
          {/* Year selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('ANALYTICS.YEAR_A')}</label>
              <select
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                value={yearA ?? ''}
                onChange={(e) => setYearA(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">{t('ANALYTICS.SELECT_YEAR')}</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('ANALYTICS.YEAR_B')}</label>
              <select
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                value={yearB ?? ''}
                onChange={(e) => setYearB(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">{t('ANALYTICS.SELECT_YEAR')}</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sensor filter — reuse DeviceSelector for consistent a11y */}
          {sensors.length > 0 && (
            <DeviceSelector
              devices={sensors}
              selectedDevices={selectedSensors}
              onChange={setSelectedSensors}
              mappings={mappings}
              colorMap={{}}
              className="mb-6"
            />
          )}

          {/* Chart */}
          {(yearA || yearB) && selectedSensors.length > 0 ? (
            <AnalyticsBarChart
              yearA={yearA}
              yearB={yearB}
              selectedSensors={selectedSensors}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('ANALYTICS.NO_DATA')}</p>
          )}
        </>
      )}

      <ToastContainer />
    </div>
  )
}

export default AnalyticsPage
