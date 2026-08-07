import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'
import { Chart } from 'chart.js'
import { getDailyAvgTemps, getHourlyAvgTemps, getMonthlyAvgTemps } from '../../lib/analyticsDb'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)
Chart.register(zoomPlugin)

const COLOR_A = '#3b82f6'
const COLOR_B = '#f97316'
const COLOR_DELTA_POS = 'rgba(239,68,68,0.7)'
const COLOR_DELTA_NEG = 'rgba(59,130,246,0.7)'
const HOURS = Array.from({ length: 24 }, (_, i) => i)

interface AnalyticsBarChartProps {
  yearA: number | null
  yearB: number | null
  selectedSensors: string[]
}

// null = monthly overview | { month } = daily | { month, day } = hourly
type DrilldownState = { month: number; day?: number } | null

function makeLineDatasets(
  labels: (string | number)[],
  dataA: (number | null)[],
  dataB: (number | null)[],
  yearA: number | null,
  yearB: number | null,
  showDelta: boolean,
  canShowDelta: boolean,
  deltaData: (number | null)[],
  t: (key: string, opts?: Record<string, unknown>) => string
): ChartData<'line'> {
  if (showDelta && canShowDelta) {
    return {
      labels: labels.map(String),
      datasets: [
        {
          label: t('ANALYTICS.DELTA_LABEL', { yearA, yearB }),
          data: deltaData,
          borderColor: '#8b5cf6',
          backgroundColor: deltaData.map((v) =>
            v == null ? 'transparent' : v >= 0 ? COLOR_DELTA_POS : COLOR_DELTA_NEG
          ),
          fill: false,
          tension: 0.3,
          pointRadius: 4,
        },
      ],
    }
  }
  return {
    labels: labels.map(String),
    datasets: [
      ...(yearA ? [{
        label: String(yearA),
        data: dataA,
        borderColor: COLOR_A,
        backgroundColor: COLOR_A + '33',
        tension: 0.3,
        pointRadius: 3,
      }] : []),
      ...(yearB ? [{
        label: String(yearB),
        data: dataB,
        borderColor: COLOR_B,
        backgroundColor: COLOR_B + '33',
        tension: 0.3,
        pointRadius: 3,
      }] : []),
    ],
  }
}

export const AnalyticsBarChart: React.FC<AnalyticsBarChartProps> = ({
  yearA,
  yearB,
  selectedSensors,
}) => {
  const { t, i18n } = useTranslation()
  const [monthlyA, setMonthlyA] = useState<Record<number, number>>({})
  const [monthlyB, setMonthlyB] = useState<Record<number, number>>({})
  const [dailyA, setDailyA] = useState<Record<number, number>>({})
  const [dailyB, setDailyB] = useState<Record<number, number>>({})
  const [hourlyA, setHourlyA] = useState<Record<number, number>>({})
  const [hourlyB, setHourlyB] = useState<Record<number, number>>({})
  const [drilldown, setDrilldown] = useState<DrilldownState>(null)
  const [showDelta, setShowDelta] = useState(false)
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(false)
  const [isDailyLoading, setIsDailyLoading] = useState(false)
  const [isHourlyLoading, setIsHourlyLoading] = useState(false)
  const chartRef = useRef<import('chart.js').Chart<'line'> | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const monthLabels = useMemo(() =>
    Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString(i18n.language, { month: 'short' })
    ), [i18n.language])

  const fullMonthNames = useMemo(() =>
    Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString(i18n.language, { month: 'long' })
    ), [i18n.language])

  // Monthly data
  useEffect(() => {
    if (!yearA && !yearB) return
    setIsMonthlyLoading(true)
    Promise.all([
      yearA ? getMonthlyAvgTemps(yearA, selectedSensors) : Promise.resolve({}),
      yearB ? getMonthlyAvgTemps(yearB, selectedSensors) : Promise.resolve({}),
    ]).then(([a, b]) => { setMonthlyA(a); setMonthlyB(b); setIsMonthlyLoading(false) })
  }, [yearA, yearB, selectedSensors])

  // Daily data when a month is drilled into
  useEffect(() => {
    if (!drilldown) return
    setIsDailyLoading(true)
    const { month } = drilldown
    Promise.all([
      yearA ? getDailyAvgTemps(yearA, month, selectedSensors) : Promise.resolve({}),
      yearB ? getDailyAvgTemps(yearB, month, selectedSensors) : Promise.resolve({}),
    ]).then(([a, b]) => { setDailyA(a); setDailyB(b); setIsDailyLoading(false) })
  }, [drilldown?.month, yearA, yearB, selectedSensors])

  // Hourly data when a day is drilled into
  useEffect(() => {
    if (!drilldown?.day) return
    setIsHourlyLoading(true)
    const { month, day } = drilldown
    Promise.all([
      yearA ? getHourlyAvgTemps(yearA, month, day, selectedSensors) : Promise.resolve({}),
      yearB ? getHourlyAvgTemps(yearB, month, day, selectedSensors) : Promise.resolve({}),
    ]).then(([a, b]) => { setHourlyA(a); setHourlyB(b); setIsHourlyLoading(false) })
  }, [drilldown?.day, drilldown?.month, yearA, yearB, selectedSensors])

  const drilldownDays = useMemo(() => {
    const days = new Set([...Object.keys(dailyA), ...Object.keys(dailyB)].map(Number))
    return Array.from(days).sort((a, b) => a - b)
  }, [dailyA, dailyB])

  const canShowDelta = yearA !== null && yearB !== null

  // Daily chart data + delta
  const dailyDeltaData = useMemo(() =>
    drilldownDays.map((d) => {
      const a = dailyA[d], b = dailyB[d]
      if (a == null || b == null) return null
      return Math.round((a - b) * 100) / 100
    }), [dailyA, dailyB, drilldownDays])

  const dailyLineData = useMemo(() =>
    makeLineDatasets(
      drilldownDays,
      drilldownDays.map((d) => dailyA[d] ?? null),
      drilldownDays.map((d) => dailyB[d] ?? null),
      yearA, yearB, showDelta, canShowDelta, dailyDeltaData, t
    ), [dailyA, dailyB, drilldownDays, yearA, yearB, showDelta, canShowDelta, dailyDeltaData, t])

  // Hourly chart data + delta
  const hourlyDeltaData = useMemo(() =>
    HOURS.map((h) => {
      const a = hourlyA[h], b = hourlyB[h]
      if (a == null || b == null) return null
      return Math.round((a - b) * 100) / 100
    }), [hourlyA, hourlyB])

  const hourlyLineData = useMemo(() =>
    makeLineDatasets(
      HOURS,
      HOURS.map((h) => hourlyA[h] ?? null),
      HOURS.map((h) => hourlyB[h] ?? null),
      yearA, yearB, showDelta, canShowDelta, hourlyDeltaData, t
    ), [hourlyA, hourlyB, yearA, yearB, showDelta, canShowDelta, hourlyDeltaData, t])

  const barOptions: ChartOptions<'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: true,
    cursor: 'pointer',
    onClick: (_event, elements) => {
      if (elements.length === 0) return
      setDrilldown({ month: elements[0].index + 1 })
      setShowDelta(false)
      setIsZoomed(false)
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: t('ANALYTICS.MONTHLY_AVG_TITLE') },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(1) ?? '–'} °C`,
        },
      },
    },
    scales: {
      y: { title: { display: true, text: t('METRICS.TEMPERATURE_UNIT') } },
    },
  }), [t])

  function makeLineOptions(
    title: string,
    xLabel: string,
    onPointClick?: (idx: number) => void
  ): ChartOptions<'line'> {
    return {
      responsive: true,
      maintainAspectRatio: true,
      onClick: onPointClick
        ? (_event, elements) => {
            if (elements.length === 0) return
            onPointClick(elements[0].index)
          }
        : undefined,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: title },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed.y
              if (v == null) return ''
              if (showDelta) {
                const sign = v > 0 ? '+' : ''
                return t('ANALYTICS.DELTA_TOOLTIP_LABEL', { value: `${sign}${v.toFixed(1)}` })
              }
              return `${ctx.dataset.label}: ${v.toFixed(1)} °C`
            },
          },
        },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x',
            onZoom: () => setIsZoomed(true),
          },
        },
      },
      scales: {
        x: { title: { display: true, text: xLabel } },
        y: {
          title: { display: true, text: showDelta ? t('ANALYTICS.DELTA_UNIT') : t('METRICS.TEMPERATURE_UNIT') },
          grid: showDelta
            ? { color: (ctx) => ctx.tick.value === 0 ? 'rgba(100,100,100,0.5)' : 'rgba(200,200,200,0.15)' }
            : undefined,
        },
      },
    }
  }

  const dailyTitle = drilldown ? t('ANALYTICS.DRILLDOWN_TITLE', { month: fullMonthNames[drilldown.month - 1] }) : ''
  const hourlyTitle = drilldown?.day != null
    ? t('ANALYTICS.HOURLY_TITLE', { day: drilldown.day, month: fullMonthNames[drilldown.month - 1] })
    : ''

  const dailyOptions = useMemo(() =>
    makeLineOptions(
      dailyTitle,
      t('ANALYTICS.DAY_OF_MONTH'),
      (idx) => {
        const day = drilldownDays[idx]
        if (day != null) { setDrilldown((d) => d ? { month: d.month, day } : null); setShowDelta(false); setIsZoomed(false) }
      }
    ),
    [dailyTitle, t, showDelta, drilldownDays])

  const hourlyOptions = useMemo(() =>
    makeLineOptions(hourlyTitle, t('ANALYTICS.HOUR_OF_DAY')),
    [hourlyTitle, t, showDelta])

  // Navigation helpers
  const inHourly = drilldown != null && drilldown.day != null
  const inDaily = drilldown != null && drilldown.day == null

  function goBack() {
    if (inHourly) {
      setDrilldown({ month: drilldown!.month })
    } else {
      setDrilldown(null)
    }
    setIsZoomed(false)
  }

  // Prev / next for daily view (month navigation)
  function prevMonth() {
    if (!drilldown) return
    const m = drilldown.month === 1 ? 12 : drilldown.month - 1
    setDrilldown({ month: m }); setIsZoomed(false)
  }
  function nextMonth() {
    if (!drilldown) return
    const m = drilldown.month === 12 ? 1 : drilldown.month + 1
    setDrilldown({ month: m }); setIsZoomed(false)
  }

  // Prev / next for hourly view (day navigation within current month's days)
  function prevDay() {
    if (!drilldown?.day) return
    const idx = drilldownDays.indexOf(drilldown.day)
    if (idx > 0) { setDrilldown({ month: drilldown.month, day: drilldownDays[idx - 1] }); setIsZoomed(false) }
  }
  function nextDay() {
    if (!drilldown?.day) return
    const idx = drilldownDays.indexOf(drilldown.day)
    if (idx < drilldownDays.length - 1) { setDrilldown({ month: drilldown.month, day: drilldownDays[idx + 1] }); setIsZoomed(false) }
  }

  const barData: ChartData<'bar'> = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    const datasets = []
    if (yearA) datasets.push({
      label: String(yearA),
      data: months.map((m) => monthlyA[m] ?? null),
      backgroundColor: COLOR_A + 'cc', borderColor: COLOR_A, borderWidth: 1, borderRadius: 4,
    })
    if (yearB) datasets.push({
      label: String(yearB),
      data: months.map((m) => monthlyB[m] ?? null),
      backgroundColor: COLOR_B + 'cc', borderColor: COLOR_B, borderWidth: 1, borderRadius: 4,
    })
    return { labels: monthLabels, datasets }
  }, [monthlyA, monthlyB, yearA, yearB, monthLabels])

  if (isMonthlyLoading && !drilldown) {
    return <p className="text-gray-500 dark:text-gray-400 text-sm">{t('ANALYTICS.LOADING')}</p>
  }

  const navBtn = 'text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded disabled:opacity-40 disabled:cursor-not-allowed'

  return (
    <div>
      {drilldown ? (
        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button className={navBtn} onClick={goBack}>
              ← {inHourly ? t('ANALYTICS.HOURLY_BACK') : t('ANALYTICS.DRILLDOWN_BACK')}
            </button>

            {/* Prev / Next */}
            {inDaily && (
              <>
                <button className={navBtn} onClick={prevMonth}>‹ {t('ANALYTICS.PREV')}</button>
                <span className="text-sm font-medium px-1">{fullMonthNames[drilldown.month - 1]}</span>
                <button className={navBtn} onClick={nextMonth}>{t('ANALYTICS.NEXT')} ›</button>
              </>
            )}
            {inHourly && drilldown.day != null && (
              <>
                <button
                  className={navBtn}
                  disabled={drilldownDays.indexOf(drilldown.day) === 0}
                  onClick={prevDay}
                >‹ {t('ANALYTICS.PREV')}</button>
                <span className="text-sm font-medium px-1">
                  {fullMonthNames[drilldown.month - 1]} {drilldown.day}
                </span>
                <button
                  className={navBtn}
                  disabled={drilldownDays.indexOf(drilldown.day) === drilldownDays.length - 1}
                  onClick={nextDay}
                >{t('ANALYTICS.NEXT')} ›</button>
              </>
            )}

            {/* Delta toggle */}
            <button
              disabled={!canShowDelta}
              aria-pressed={showDelta}
              className={`text-sm px-3 py-1.5 rounded transition-colors ${
                !canShowDelta
                  ? 'opacity-40 cursor-not-allowed bg-gray-200 dark:bg-gray-700'
                  : showDelta
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              onClick={() => canShowDelta && setShowDelta((v) => !v)}
            >
              {t('ANALYTICS.SHOW_DELTA')}
            </button>

            {isZoomed && (
              <button className={navBtn} onClick={() => { chartRef.current?.resetZoom(); setIsZoomed(false) }}>
                {t('LINE_CHART.RESET_VIEW')}
              </button>
            )}
          </div>

          {showDelta && canShowDelta && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t('ANALYTICS.DELTA_HINT', { yearA, yearB })}
            </p>
          )}

          {/* Chart area */}
          {inHourly ? (
            isHourlyLoading ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('ANALYTICS.LOADING')}</p>
            ) : (
              <Line ref={chartRef} data={hourlyLineData} options={hourlyOptions} />
            )
          ) : (
            isDailyLoading ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('ANALYTICS.LOADING')}</p>
            ) : drilldownDays.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">{t('ANALYTICS.NO_DATA')}</p>
            ) : (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('ANALYTICS.DAILY_SUBTITLE')}</p>
                <Line ref={chartRef} data={dailyLineData} options={dailyOptions} />
              </>
            )
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('ANALYTICS.MONTHLY_AVG_SUBTITLE')}</p>
          <Bar data={barData} options={barOptions} />
        </div>
      )}
    </div>
  )
}
