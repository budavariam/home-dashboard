import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface AnalyticsUploaderProps {
  onUpload: (file: File) => Promise<void>
  entryCount: number
  isLoading: boolean
  onClear: () => void
}

export const AnalyticsUploader: React.FC<AnalyticsUploaderProps> = ({
  onUpload,
  entryCount,
  isLoading,
  onClear,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }

  const openPicker = () => inputRef.current?.click()

  return (
    <div className="mb-6">
      <div
        role="button"
        tabIndex={0}
        aria-label={t('ANALYTICS.UPLOAD_DRAG')}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        }`}
        onClick={openPicker}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPicker() } }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.json"
          className="hidden"
          onChange={handleChange}
          aria-hidden="true"
          tabIndex={-1}
        />
        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400">{t('ANALYTICS.UPLOAD_PROCESSING')}</p>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-300 font-medium">{t('ANALYTICS.UPLOAD_DRAG')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">CSV / JSON</p>
          </>
        )}
      </div>

      {entryCount > 0 && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-green-600 dark:text-green-400">
            {t('ANALYTICS.DATA_LOADED', { count: entryCount.toLocaleString() })}
          </span>
          <button
            className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 underline"
            onClick={onClear}
          >
            {t('ANALYTICS.CLEAR_DATA')}
          </button>
        </div>
      )}
    </div>
  )
}
