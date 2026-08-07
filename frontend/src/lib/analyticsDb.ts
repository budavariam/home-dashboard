const DB_NAME = 'home-dashboard-analytics'
const DB_VERSION = 1
const STORE = 'readings'

export interface AnalyticsEntry {
  id?: number
  ts: number
  year: number
  month: number
  day: number
  sensorName: string
  tmp: number
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
        store.createIndex('year', 'year', { unique: false })
        store.createIndex('sensorName', 'sensorName', { unique: false })
        store.createIndex('yearMonth', ['year', 'month'], { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function storeAnalyticsEntries(entries: AnalyticsEntry[]): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    let i = 0
    function next() {
      if (i >= entries.length) return
      const req = store.add(entries[i++])
      req.onsuccess = next
      req.onerror = () => reject(req.error)
    }
    next()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function clearAnalyticsData(): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).clear()
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAnalyticsEntryCount(): Promise<number> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).count()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function getAnalyticsYears(): Promise<number[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const index = tx.objectStore(STORE).index('year')
    const req = index.openKeyCursor(null, 'nextunique')
    const years: number[] = []
    req.onsuccess = () => {
      const cursor = req.result
      if (cursor) {
        years.push(cursor.key as number)
        cursor.continue()
      } else {
        resolve(years.sort((a, b) => a - b))
      }
    }
    req.onerror = () => reject(req.error)
  })
}

export async function getAnalyticsSensors(): Promise<string[]> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const index = tx.objectStore(STORE).index('sensorName')
    const req = index.openKeyCursor(null, 'nextunique')
    const sensors: string[] = []
    req.onsuccess = () => {
      const cursor = req.result
      if (cursor) {
        sensors.push(cursor.key as string)
        cursor.continue()
      } else {
        resolve(sensors.sort())
      }
    }
    req.onerror = () => reject(req.error)
  })
}

export async function getHourlyAvgTemps(
  year: number,
  month: number,
  day: number,
  sensorNames: string[]
): Promise<Record<number, number>> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const index = tx.objectStore(STORE).index('yearMonth')
    const req = index.openCursor(IDBKeyRange.only([year, month]))
    const hourSums: Record<number, { sum: number; count: number }> = {}
    req.onsuccess = () => {
      const cursor = req.result
      if (cursor) {
        const entry = cursor.value as AnalyticsEntry
        if (
          entry.day === day &&
          (sensorNames.length === 0 || sensorNames.includes(entry.sensorName))
        ) {
          const hour = new Date(entry.ts).getUTCHours()
          if (!hourSums[hour]) hourSums[hour] = { sum: 0, count: 0 }
          hourSums[hour].sum += entry.tmp
          hourSums[hour].count++
        }
        cursor.continue()
      } else {
        const result: Record<number, number> = {}
        for (const [h, { sum, count }] of Object.entries(hourSums)) {
          result[Number(h)] = Math.round((sum / count) * 100) / 100
        }
        resolve(result)
      }
    }
    req.onerror = () => reject(req.error)
  })
}
  year: number,
  sensorNames: string[]
): Promise<Record<number, number>> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const index = tx.objectStore(STORE).index('year')
    const req = index.openCursor(IDBKeyRange.only(year))
    const monthSums: Record<number, { sum: number; count: number }> = {}
    req.onsuccess = () => {
      const cursor = req.result
      if (cursor) {
        const entry = cursor.value as AnalyticsEntry
        if (sensorNames.length === 0 || sensorNames.includes(entry.sensorName)) {
          const m = entry.month
          if (!monthSums[m]) monthSums[m] = { sum: 0, count: 0 }
          monthSums[m].sum += entry.tmp
          monthSums[m].count++
        }
        cursor.continue()
      } else {
        const result: Record<number, number> = {}
        for (const [month, { sum, count }] of Object.entries(monthSums)) {
          result[Number(month)] = Math.round((sum / count) * 100) / 100
        }
        resolve(result)
      }
    }
    req.onerror = () => reject(req.error)
  })
}

export async function getDailyAvgTemps(
  year: number,
  month: number,
  sensorNames: string[]
): Promise<Record<number, number>> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const index = tx.objectStore(STORE).index('yearMonth')
    const req = index.openCursor(IDBKeyRange.only([year, month]))
    const daySums: Record<number, { sum: number; count: number }> = {}
    req.onsuccess = () => {
      const cursor = req.result
      if (cursor) {
        const entry = cursor.value as AnalyticsEntry
        if (sensorNames.length === 0 || sensorNames.includes(entry.sensorName)) {
          const d = entry.day
          if (!daySums[d]) daySums[d] = { sum: 0, count: 0 }
          daySums[d].sum += entry.tmp
          daySums[d].count++
        }
        cursor.continue()
      } else {
        const result: Record<number, number> = {}
        for (const [day, { sum, count }] of Object.entries(daySums)) {
          result[Number(day)] = Math.round((sum / count) * 100) / 100
        }
        resolve(result)
      }
    }
    req.onerror = () => reject(req.error)
  })
}
