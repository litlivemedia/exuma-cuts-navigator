import type { Activity, ActivityCondition } from '../types/activity.ts'
import type { HiLo } from '../types/tide.ts'
import type { WindHourly } from '../types/wind.ts'
import { differenceInHours, addHours, format, isSameDay, startOfDay, addDays } from 'date-fns'

/**
 * Find the nearest high tide to `now` (past or future, within 12h).
 */
function nearestHighTide(tides: HiLo[], now: Date): HiLo | null {
  let best: HiLo | null = null
  let bestDist = Infinity
  for (const t of tides) {
    if (t.type !== 'H') continue
    const dist = Math.abs(differenceInHours(t.time, now, { roundingMethod: 'trunc' }))
    if (dist < bestDist) {
      bestDist = dist
      best = t
    }
  }
  return best
}

/**
 * Get current wind direction (nearest hourly reading).
 */
function getWindDir(wind: WindHourly[], now: Date): number | null {
  if (!wind.length) return null
  let best = wind[0]
  let bestDist = Math.abs(now.getTime() - best.time.getTime())
  for (const w of wind) {
    const dist = Math.abs(now.getTime() - w.time.getTime())
    if (dist < bestDist) {
      bestDist = dist
      best = w
    }
  }
  return best.directionDeg
}

function getWindSpeed(wind: WindHourly[], now: Date): number {
  if (!wind.length) return 0
  let best = wind[0]
  let bestDist = Math.abs(now.getTime() - best.time.getTime())
  for (const w of wind) {
    const dist = Math.abs(now.getTime() - w.time.getTime())
    if (dist < bestDist) {
      bestDist = dist
      best = w
    }
  }
  return best.speedKnots
}

/**
 * Check if wind direction is within a range (handles wrap-around).
 */
function isWindInRange(dir: number, range: [number, number]): boolean {
  const [lo, hi] = range
  if (lo <= hi) return dir >= lo && dir <= hi
  // Wraps around 360 (e.g., 315 to 45)
  return dir >= lo || dir <= hi
}

export interface ActivityAssessment {
  condition: ActivityCondition
  reasons: string[]
  /** Hours until next good window, if current window is poor */
  hoursToNextGoodWindow?: number
}

/**
 * Assess current conditions for an activity.
 */
export function assessActivity(
  activity: Activity,
  tides: HiLo[],
  wind: WindHourly[],
  now: Date,
  offsetMinutes: number,
): ActivityAssessment {
  const reasons: string[] = []
  let score = 0 // 0-3, maps to poor/fair/good/ideal

  // Apply tide offset for this location
  const offsetTides = tides.map((t) => ({
    ...t,
    time: new Date(t.time.getTime() + offsetMinutes * 60000),
  }))

  // --- Tide window check ---
  if (activity.tideWindow) {
    const nearHigh = nearestHighTide(offsetTides, now)
    if (nearHigh) {
      const hoursFromHigh = (now.getTime() - nearHigh.time.getTime()) / 3600000
      const [lo, hi] = activity.tideWindow.relativeToHigh
      if (hoursFromHigh >= lo && hoursFromHigh <= hi) {
        score += 2
        if (Math.abs(hoursFromHigh) < 1) {
          reasons.push('Near high tide — ideal window')
        } else {
          reasons.push('Within the tide window')
        }
      } else if (hoursFromHigh > hi && hoursFromHigh < hi + 1) {
        score += 1
        reasons.push('Tide window closing — water getting shallow')
      } else {
        reasons.push('Outside the best tide window')
      }
    }
  }

  // --- Strong current check (for washing machine) ---
  if (activity.bestWithStrongCurrent) {
    const nearHigh = nearestHighTide(offsetTides, now)
    if (nearHigh) {
      const hoursFromHigh = Math.abs((now.getTime() - nearHigh.time.getTime()) / 3600000)
      // Current is strongest 2-4 hours from high/low (mid-tide)
      if (hoursFromHigh >= 2 && hoursFromHigh <= 4) {
        score += 2
        reasons.push('Strong tidal current — rapids at their best')
      } else if (hoursFromHigh >= 1.5 && hoursFromHigh <= 5) {
        score += 1
        reasons.push('Moderate tidal current')
      } else {
        reasons.push('Near slack — minimal rapids')
      }
    }
  }

  // --- Rough seas check (for Rachel's Bubble Bath) ---
  if (activity.bestWithRoughSeas) {
    const windSpeed = getWindSpeed(wind, now)
    const windDir = getWindDir(wind, now)

    if (windSpeed >= 15 && windDir != null && activity.preferredWindDirRange && isWindInRange(windDir, activity.preferredWindDirRange)) {
      score += 2
      reasons.push('Strong N-E winds — big waves crashing over the rocks')
    } else if (windSpeed >= 12) {
      score += 1
      reasons.push('Moderate winds — some wave action')
    } else {
      reasons.push('Calm conditions — pool will be flat, no bubbles')
    }

    // Higher tide also helps
    const nearHigh = nearestHighTide(offsetTides, now)
    if (nearHigh) {
      const hoursFromHigh = Math.abs((now.getTime() - nearHigh.time.getTime()) / 3600000)
      if (hoursFromHigh <= 2) {
        score += 1
        reasons.push('Near high tide — more water over the rocks')
      }
    }
  }

  // Default: if no specific conditions apply, it's at least fair
  if (!activity.tideWindow && !activity.bestWithStrongCurrent && !activity.bestWithRoughSeas) {
    score = 2
    reasons.push('Generally accessible')
  }

  const condition: ActivityCondition =
    score >= 3 ? 'ideal' : score >= 2 ? 'good' : score >= 1 ? 'fair' : 'poor'

  return { condition, reasons }
}

export interface TripWindow {
  start: Date
  end: Date
  peakTime: Date
  label: string
  condition: ActivityCondition
  dayLabel: string
}

/**
 * Get upcoming trip windows for an activity over the next 3 days.
 */
export function getActivityTripWindows(
  activity: Activity,
  tides: HiLo[],
  wind: WindHourly[],
  now: Date,
  offsetMinutes: number,
): TripWindow[] {
  const offsetTides = tides.map((t) => ({
    ...t,
    time: new Date(t.time.getTime() + offsetMinutes * 60000),
  }))

  const windows: TripWindow[] = []
  const cutoff = addDays(startOfDay(now), 3)

  // For tide-window activities (Lazy River): window around each high tide
  if (activity.tideWindow) {
    const [lo, hi] = activity.tideWindow.relativeToHigh
    for (const t of offsetTides) {
      if (t.type !== 'H') continue
      const start = addHours(t.time, lo)
      const end = addHours(t.time, hi)
      if (end < now || start > cutoff) continue
      // Only daylight windows (6am-7pm)
      const hour = t.time.getHours()
      if (hour < 5 || hour > 19) continue

      windows.push({
        start,
        end,
        peakTime: t.time,
        label: `High tide ${format(t.time, 'h:mm a')}`,
        condition: assessActivity(activity, tides, wind, t.time, offsetMinutes).condition,
        dayLabel: isSameDay(start, now) ? 'Today' : isSameDay(start, addDays(now, 1)) ? 'Tomorrow' : format(start, 'EEEE, MMM d'),
      })
    }
  }

  // For strong-current activities (Washing Machine): mid-tide windows
  if (activity.bestWithStrongCurrent) {
    for (const t of offsetTides) {
      if (t.type !== 'H') continue
      const peakEbb = addHours(t.time, 3) // 3h after high = peak ebb
      const peakFlood = addHours(t.time, -3) // 3h before high = peak flood
      for (const peak of [peakFlood, peakEbb]) {
        if (peak < now || peak > cutoff) continue
        const hour = peak.getHours()
        if (hour < 6 || hour > 18) continue
        const start = addHours(peak, -1)
        const end = addHours(peak, 1)
        const direction = peak === peakEbb ? 'ebb' : 'flood'
        windows.push({
          start,
          end,
          peakTime: peak,
          label: `Peak ${direction} current`,
          condition: assessActivity(activity, tides, wind, peak, offsetMinutes).condition,
          dayLabel: isSameDay(peak, now) ? 'Today' : isSameDay(peak, addDays(now, 1)) ? 'Tomorrow' : format(peak, 'EEEE, MMM d'),
        })
      }
    }
  }

  // For rough-seas activities (Rachel's Bubble Bath): high tides with wind check
  if (activity.bestWithRoughSeas) {
    for (const t of offsetTides) {
      if (t.type !== 'H') continue
      const start = addHours(t.time, -2)
      const end = addHours(t.time, 2)
      if (end < now || start > cutoff) continue
      const hour = t.time.getHours()
      if (hour < 6 || hour > 18) continue
      windows.push({
        start,
        end,
        peakTime: t.time,
        label: `High tide ${format(t.time, 'h:mm a')}`,
        condition: assessActivity(activity, tides, wind, t.time, offsetMinutes).condition,
        dayLabel: isSameDay(start, now) ? 'Today' : isSameDay(start, addDays(now, 1)) ? 'Tomorrow' : format(start, 'EEEE, MMM d'),
      })
    }
  }

  // Sort by start time
  windows.sort((a, b) => a.start.getTime() - b.start.getTime())
  return windows
}
