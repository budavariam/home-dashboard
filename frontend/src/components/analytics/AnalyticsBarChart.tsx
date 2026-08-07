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
import { getDailyAvgTemps, getMonthlyAvgTemps } from '../../lib/analyticsDb'

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

interface AnalyticsBarChartProps {
  yearA: number | null
  yearB: number | null
  selectedSensors: string[]
}

type DrilldownState = { month: number } | null

export const AnalyticsBarChart: React.FC<AnalyticsBarChartProps> = ({
  yearA,
  yearB,
  selectedSensors,
}) => {
  const { t, i18n } = useTranslation()
  const [monthlyA, setMonthlyA] = useState<Record<number, number>>({})
  const [monthlyB, setMonthlyB] = useState<Record<number, number>>({})
  const [drilldown, setDrilldown] = useState<DrilldownState>(null)
  const [dailyA, setDailyA] = useState<Record<number, number>>({})
  const [dailyB, setDailyB] = useState<Record<number, number>>({})
  const [showDelta, setShowDelta] = useState(false)
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(false)
  const [isDrilldownLoading, setIsDrilldownLoading] = useState(false)
  const drilldownChartRef = useRef<import('chart.js').Chart<'line'> | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const monthLabels = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString(i18n.language, { month: 'short' })
    )
  }, [i18n.language])

  const fullMonthNames = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) =>
      new Date(2000, i, 1).toLocaleString(i18n.language, { month: 'long' })
    )
  }, [i18n.language])

  // Load monthly data
  useEffect(() => {
    if (!yearA && !yearB) return
    setIsMonthlyLoading(true)
    const promises = [
      yearA ? getMonthlyAvgTemps(yearA, selectedSensors) : Promise.resolve({}),
      yearB ? getMonthlyAvgTemps(yearB, selectedSensors) : Promise.resolve({}),
    ]
    Promise.all(promises).then(([a, b]) => {
      setMonthlyA(a)
      setMonthlyB(b)
      setIsMonthlyLoading(false)
    })
  }, [yearA, yearB, selectedSensors])

  // Load daily data when drilling down
  useEffect(() => {
    if (!drilldown) return
    setIsDrilldownLoading(true)
    const { month } = drilldown
    const loaders = [
      yearA ? getDailyAvgTemps(yearA, month, selectedSensors) : Promise.resolve({}),
      yearB ? getDailyAvgTemps(yearB, month, selectedSensors) : Promise.resolve({}),
    ]
    Promise.all(loaders).then(([a, b]) => {
      setDailyA(a)
      setDailyB(b)
      setIsDrilldownLoading(false)
    })
  }, [drilldown, yearA, yearB, selectedSensors])

  const barData: ChartData<'bar'> = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    const datasets = []
    if (yearA) {
      datasets.push({
        label: String(yearA),
        data: months.map((m) => monthlyA[m] ?? null),
        backgroundColor: COLOR_A + 'cc',
        borderColor: COLOR_A,
        borderWidth: 1,
        borderRadius: 4,
      })
    }
    if (yearB) {
      datasets.push({
        label: String(yearB),
        data: months.map((m) => monthlyB[m] ?? null),
        backgroundColor: COLOR_B + 'cc',
        borderColor: COLOR_B,
        borderWidth: 1,
        borderRadius: 4,
      })
    }
    return { labels: monthLabels, datasets }
  }, [monthlyA, monthlyB, yearA, yearB, monthLabels])

  const barOptions: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      onClick: (_event, elements) => {
        if (elements.length === 0) return
        const idx = elements[0].index
        setDrilldown({ month: idx + 1 })
        setShowDelta(false)
        setIsZoomed(false)
      },
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: t('ANALYTICS.MONTHLY_AVG_TITLE'),
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(1) ?? '–'} °C`,
          },
        },
      },
      scales: {
        y: {
          title: { display: true, text: t('METRICS.TEMPERATURE_UNIT') },
        },
      },
    }),
    [t]
  )

  const drilldownDays = useMemo(() => {
    const days = new Set([...Object.keys(dailyA), ...Object.keys(dailyB)].map(Number))
    return Array.from(days).sort((a, b) => a - b)
  }, [dailyA, dailyB])

  const deltaData = useMemo(() => {
    return drilldownDays.map((d) => {
      const a = dailyA[d]
      const b = dailyB[d]
      if (a == null || b == null) return null
      return Math.round((a - b) * 100) / 100
    })
  }, [dailyA, dailyB, drilldownDays])

  const canShowDelta = yearA !== null && yearB !== null

  const lineData: ChartData<'line'> = useMemo(() => {
    if (showDelta && canShowDelta) {
      return {
        labels: drilldownDays.map(String),
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
      labels: drilldownDays.map(String),
      datasets: [
        ...(yearA
          ? [
              {
                label: String(yearA),
                data: drilldownDays.map((d) => dailyA[d] ?? null),
                borderColor: COLOR_A,
                backgroundColor: COLOR_A + '33',
                tension: 0.3,
                pointRadius: 3,
              },
            ]
          : []),
        ...(yearB
          ? [
              {
                label: String(yearB),
                data: drilldownDays.map((d) => dailyB[d] ?? null),
                borderColor: COLOR_B,
                backgroundColor: COLOR_B + '33',
                tension: 0.3,
                pointRadius: 3,
              },
            ]
          : []),
      ],
    }
  }, [dailyA, dailyB, drilldownDays, yearA, yearB, showDelta, canShowDelta, deltaData, t])

  const lineOptions: ChartOptions<'line'> = useMemo(() => {
    const monthName = drilldown ? fullMonthNames[drilldown.month - 1] : ''
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: t('ANALYTICS.DRILLDOWN_TITLE', { month: monthName }),
        },
        tooltip: {
          callbacks: {
            title: (items) => `${t('ANALYTICS.DAY')} ${items[0]?.label}`,
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
        x: { title: { display: true, text: t('ANALYTICS.DAY_OF_MONTH') } },
        y: {
          title: { display: true, text: showDelta ? t('ANALYTICS.DELTA_UNIT') : t('METRICS.TEMPERATURE_UNIT') },
          grid: showDelta
            ? {
                color: (ctx) =>
                  ctx.tick.value === 0
                    ? 'rgba(100,100,100,0.5)'
                    : 'rgba(200,200,200,0.15)',
              }
            : undefined,
        },
      },
    }
  }, [t, drilldown, fullMonthNames, showDelta])

  if (isMonthlyLoading && !drilldown) {
    return <p className="text-gray-500 dark:text-gray-400 text-sm">{t('ANALYTICS.LOADING')}</p>
  }

  return (
    <div>
      {drilldown ? (
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded"
              onClick={() => { setDrilldown(null); setIsZoomed(false) }}
            >
              ← {t('ANALYTICS.DRILLDOWN_BACK')}
            </button>
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
              <button
                className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1.5 rounded"
                onClick={() => {
                  drilldownChartRef.current?.resetZoom()
                  setIsZoomed(false)
                }}
              >
                {t('LINE_CHART.RESET_VIEW')}
              </button>
            )}
          </div>

          {showDelta && canShowDelta && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t('ANALYTICS.DELTA_HINT', { yearA, yearB })}
            </p>
          )}

          {isDrilldownLoading ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('ANALYTICS.LOADING')}</p>
          ) : drilldownDays.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t('ANALYTICS.NO_DATA')}</p>
          ) : (
            <Line
              ref={drilldownChartRef}
              data={lineData}
              options={lineOptions}
            />
          )}
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t('ANALYTICS.MONTHLY_AVG_SUBTITLE')}
          </p>
          <Bar data={barData} options={barOptions} />
        </div>
      )}
    </div>
  )
}
