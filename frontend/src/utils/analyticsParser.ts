const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/

export interface ParsedSensor {
  name: string
  tmp: number
  bat?: number
  hum?: number
}

export interface ParsedRow {
  globalTs: string
  sensors: ParsedSensor[]
}

function splitSemicolonLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ';' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current.trim())
  return fields
}

function parseSensorGroup(group: string[]): ParsedSensor | null {
  // group: [name, bat, hum, (operating, pow)?, tmp, sensorTs]
  // tmp is always at index length-2, ts is at length-1
  if (group.length < 3) return null
  const name = group[0]
  if (!name || ISO_DATE_RE.test(name)) return null
  const tmp = parseFloat(group[group.length - 2])
  if (isNaN(tmp)) return null
  return {
    name,
    tmp,
    bat: isNaN(parseFloat(group[1])) ? undefined : parseFloat(group[1]),
    hum: isNaN(parseFloat(group[2])) ? undefined : parseFloat(group[2]),
  }
}

export function parseAnalyticsCsv(text: string): ParsedRow[] {
  const lines = text.split('\n')
  const results: ParsedRow[] = []

  // Skip header line
  for (let li = 1; li < lines.length; li++) {
    const line = lines[li].trim()
    if (!line) continue

    const fields = splitSemicolonLine(line)
    if (fields.length < 2) continue

    const globalTs = fields[fields.length - 1]
    if (!ISO_DATE_RE.test(globalTs)) continue

    const sensors: ParsedSensor[] = []
    let group: string[] = []

    for (let i = 0; i < fields.length - 1; i++) {
      const f = fields[i]
      group.push(f)
      if (ISO_DATE_RE.test(f)) {
        const sensor = parseSensorGroup(group)
        if (sensor) sensors.push(sensor)
        group = []
      }
    }

    if (sensors.length > 0) {
      results.push({ globalTs, sensors })
    }
  }

  return results
}

export function parseAnalyticsJson(text: string): ParsedRow[] {
  // Support both the ApiResponse[] format and a flat array of rows
  const data = JSON.parse(text)
  const rows: ParsedRow[] = []

  const items: unknown[] = Array.isArray(data) ? data : [data]
  for (const item of items) {
    if (typeof item !== 'object' || item === null) continue
    const obj = item as Record<string, unknown>

    // ApiResponse format: { val: { readings: [...] }, ts: number }
    const val = obj['val']
    const tsMs = typeof obj['ts'] === 'number' ? obj['ts'] : null
    if (!tsMs) continue
    const globalTs = new Date(tsMs).toISOString()

    if (val && typeof val === 'object') {
      const valObj = val as Record<string, unknown>
      const readings = Array.isArray(valObj['readings']) ? valObj['readings'] : []
      const sensors: ParsedSensor[] = []
      for (const r of readings) {
        if (typeof r !== 'object' || r === null) continue
        const rObj = r as Record<string, unknown>
        const rr = rObj['r'] as Record<string, number> | undefined
        if (!rr) continue
        const tmp = typeof rr['tmp'] === 'number' ? rr['tmp'] : NaN
        if (isNaN(tmp)) continue
        sensors.push({
          name: String(rObj['n'] ?? 'unknown'),
          tmp,
          bat: typeof rr['bat'] === 'number' ? rr['bat'] : undefined,
          hum: typeof rr['hum'] === 'number' ? rr['hum'] : undefined,
        })
      }
      if (sensors.length > 0) rows.push({ globalTs, sensors })
    }
  }

  return rows
}
