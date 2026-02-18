import { differenceInHours, format, startOfDay, addDays } from 'date-fns'
import type { HiLo } from '../types/tide.ts'
import type { WindHourly } from '../types/wind.ts'
import type { CutDefinition } from '../types/cut.ts'
import {
  applyOffset,
  getSlackWindows,
  interpolateTideHeight,
  findSurroundingEvents,
  estimateCurrentKnots,
  type SlackWindow,
} from './tideCalculator.ts'
import { getWindAtTime, degreesToCardinal } from './wind.ts'
import { isWindAgainstCurrent } from './safetyEngine.ts'

// ── Types ──────────────────────────────────────────────────────

export interface TransitWindow {
  /** Slack window center time */
  time: Date
  /** Slack window start/end */
  start: Date
  end: Date
  /** High or Low slack */
  type: 'H' | 'L'
  /** Overall score 1-10 */
  score: number
  /** Confidence: 'high' (today), 'good' (tomorrow), 'moderate' (day 3) */
  confidence: 'high' | 'good' | 'moderate'
  /** Short description of conditions */
  summary: string
  /** Individual factor scores for tooltip/detail */
  factors: {
    slackQuality: number   // 0-10 how close to perfect slack
    windScore: number      // 0-10 lower wind = higher
    windOpposing: boolean
    daylight: boolean
    /** Only for depth-critical cuts */
    depthScore?: number    // 0-10
    depthFt?: number
  }
  /** Wind at this window */
  windSpeedKnots: number
  windGustKnots: number
  windCardinal: string
  /** Current speed estimate at window center */
  currentSpeedKnots: number
  /** Tide height at window */
  heightFt: number
  /** Depth at window (depth-critical only) */
  depthFt: number | null
}

export interface TransitDay {
  date: Date
  label: string // "Today", "Tomorrow", "Wednesday"
  windows: TransitWindow[]
  bestWindow: TransitWindow | null
}

// ── Scoring ────────────────────────────────────────────────────

const DAYLIGHT_START = 6.5  // 6:30 AM
const DAYLIGHT_END = 18.5   // 6:30 PM

function isDaylight(date: Date): boolean {
  const h = date.getHours() + date.getMinutes() / 60
  return h >= DAYLIGHT_START && h <= DAYLIGHT_END
}

function scoreSlackQuality(window: SlackWindow): number {
  // High slack is generally better than low slack (more water, less turbulence)
  const base = window.type === 'H' ? 9 : 7
  return base
}

function scoreWind(speedKnots: number, gustKnots: number, opposing: boolean): number {
  if (opposing && speedKnots >= 15) return 1
  if (opposing && speedKnots >= 10) return 3
  if (opposing) return 5
  if (gustKnots >= 25) return 2
  if (speedKnots >= 20) return 3
  if (speedKnots >= 15) return 5
  if (speedKnots >= 10) return 7
  if (speedKnots >= 5) return 9
  return 10
}

function scoreDepth(depthFt: number): number {
  // For depth-critical cuts: score based on available depth
  if (depthFt >= 8) return 10
  if (depthFt >= 7) return 9
  if (depthFt >= 6.5) return 8
  if (depthFt >= 6) return 7
  if (depthFt >= 5.5) return 6
  if (depthFt >= 5) return 5
  if (depthFt >= 4.5) return 3
  if (depthFt >= 4) return 2
  return 1
}

function getConfidence(hoursFromNow: number): 'high' | 'good' | 'moderate' {
  if (hoursFromNow <= 24) return 'high'
  if (hoursFromNow <= 48) return 'good'
  return 'moderate'
}

function computeOverallScore(
  slackScore: number,
  windScore: number,
  isDepthCritical: boolean,
  depthScore: number | undefined,
  confidence: 'high' | 'good' | 'moderate',
  isDaylightWindow: boolean,
): number {
  let score: number

  if (isDepthCritical && depthScore != null) {
    // Depth-critical: depth is 40%, slack 20%, wind 30%, daylight 10%
    score = depthScore * 0.4 + slackScore * 0.2 + windScore * 0.3 + (isDaylightWindow ? 1 : 0)
  } else {
    // Standard: slack 35%, wind 45%, daylight 20%
    score = slackScore * 0.35 + windScore * 0.45 + (isDaylightWindow ? 2 : 0)
  }

  // Confidence penalty
  if (confidence === 'good') score *= 0.95
  if (confidence === 'moderate') score *= 0.88

  // Nighttime penalty — not zero but strongly discouraged
  if (!isDaylightWindow) score *= 0.4

  return Math.max(1, Math.min(10, Math.round(score)))
}

function buildSummary(
  window: TransitWindow,
  cut: CutDefinition,
): string {
  const parts: string[] = []

  const slackLabel = window.type === 'H' ? 'High slack' : 'Low slack'
  parts.push(slackLabel)

  if (cut.depthCritical && window.depthFt != null) {
    parts.push(`${window.depthFt.toFixed(1)}ft depth`)
  }

  if (window.factors.windOpposing) {
    parts.push(`${window.windCardinal} ${Math.round(window.windSpeedKnots)}kts opposing`)
  } else if (window.windSpeedKnots >= 10) {
    parts.push(`${window.windCardinal} ${Math.round(window.windSpeedKnots)}kts`)
  } else {
    parts.push(`light ${window.windCardinal}`)
  }

  if (!window.factors.daylight) {
    parts.push('dark')
  }

  return parts.join(' · ')
}

// ── Main function ──────────────────────────────────────────────

export function scoreTransitWindows(
  cut: CutDefinition,
  nassauTides: HiLo[],
  windData: WindHourly[],
  now: Date,
): TransitDay[] {
  const adjusted = applyOffset(nassauTides, cut.offsetMinutes)
  const allSlackWindows = getSlackWindows(adjusted)

  // Get all future slack windows within 3 days
  const threeDaysMs = 3 * 24 * 3600000
  const futureWindows = allSlackWindows.filter(
    (w) =>
      w.end.getTime() > now.getTime() &&
      w.start.getTime() < now.getTime() + threeDaysMs
  )

  // Score each window
  const scored: TransitWindow[] = futureWindows.map((sw) => {
    const hoursAway = differenceInHours(sw.center, now)
    const confidence = getConfidence(hoursAway)
    const isDaylightWindow = isDaylight(sw.center)

    // Wind at this time
    const wind = getWindAtTime(windData, sw.center)
    const windSpeed = wind?.speedKnots ?? 0
    const windGust = wind?.gustKnots ?? 0
    const windDir = wind?.directionDeg ?? 0
    const windCardinal = degreesToCardinal(windDir)

    // Tide/current at slack center
    const surrounding = findSurroundingEvents(adjusted, sw.center)
    const heightFt = surrounding
      ? interpolateTideHeight(surrounding.prev, surrounding.next, sw.center)
      : 0
    const currentSpeed = surrounding
      ? estimateCurrentKnots(surrounding.prev, surrounding.next, sw.center, cut.maxCurrentKnots)
      : 0

    // Current direction at window edges (for wind opposition check)
    // At slack center it's ~0 knots, but check if wind would oppose approaching current
    const direction = sw.type === 'H'
      ? 'flooding' as const // approaching high = flooding
      : 'ebbing' as const   // approaching low = ebbing
    const windOpposing = isWindAgainstCurrent(direction, windDir, windSpeed, cut.bearingDeg)

    // Depth for depth-critical
    let depthFt: number | null = null
    let depthScoreVal: number | undefined
    if (cut.depthCritical && cut.mlwDepthFt != null) {
      depthFt = cut.mlwDepthFt + heightFt
      depthScoreVal = scoreDepth(depthFt)
    }

    const slackScore = scoreSlackQuality(sw)
    const windScore = scoreWind(windSpeed, windGust, windOpposing)
    const score = computeOverallScore(
      slackScore,
      windScore,
      !!cut.depthCritical,
      depthScoreVal,
      confidence,
      isDaylightWindow,
    )

    const tw: TransitWindow = {
      time: sw.center,
      start: sw.start,
      end: sw.end,
      type: sw.type,
      score,
      confidence,
      summary: '', // filled below
      factors: {
        slackQuality: slackScore,
        windScore,
        windOpposing,
        daylight: isDaylightWindow,
        depthScore: depthScoreVal,
        depthFt: depthFt ?? undefined,
      },
      windSpeedKnots: windSpeed,
      windGustKnots: windGust,
      windCardinal,
      currentSpeedKnots: currentSpeed,
      heightFt,
      depthFt,
    }

    tw.summary = buildSummary(tw, cut)
    return tw
  })

  // Group by day
  const today = startOfDay(now)
  const tomorrow = addDays(today, 1)
  const dayAfter = addDays(today, 2)

  const dayLabels = [
    { date: today, label: 'Today' },
    { date: tomorrow, label: 'Tomorrow' },
    { date: dayAfter, label: format(dayAfter, 'EEEE') },
  ]

  return dayLabels.map(({ date, label }) => {
    const dayStart = date.getTime()
    const dayEnd = addDays(date, 1).getTime()
    const windows = scored.filter(
      (w) => w.time.getTime() >= dayStart && w.time.getTime() < dayEnd
    )
    // Filter out windows that have already fully passed
    const activeWindows = windows.filter(
      (w) => w.end.getTime() > now.getTime()
    )

    const bestWindow = activeWindows.length > 0
      ? activeWindows.reduce((best, w) => (w.score > best.score ? w : best), activeWindows[0])
      : null

    return { date, label, windows: activeWindows, bestWindow }
  })
}
