import { useMemo } from 'react'
import { format, differenceInMinutes } from 'date-fns'
import type { HiLo } from '../types/tide.ts'
import type { WindHourly } from '../types/wind.ts'
import type { CutDefinition, CutStatus } from '../types/cut.ts'
import {
  applyOffset,
  getCurrentDirection,
  estimateCurrentKnots,
  findSurroundingEvents,
  interpolateTideHeight,
  getNextEvent,
  getNextSlackWindow,
  getDaylightSlackWindows,
} from '../services/tideCalculator.ts'
import { getWindAtTime, degreesToCardinal } from '../services/wind.ts'
import { isWindAgainstCurrent, assessSafety } from '../services/safetyEngine.ts'

export function computeCutStatus(
  cut: CutDefinition,
  nassauTides: HiLo[],
  windData: WindHourly[],
  now: Date
): CutStatus {
  const adjusted = applyOffset(nassauTides, cut.offsetMinutes)
  const direction = getCurrentDirection(adjusted, now)
  const surrounding = findSurroundingEvents(adjusted, now)

  let currentSpeed = 0
  let heightFt = 0
  if (surrounding) {
    currentSpeed = estimateCurrentKnots(
      surrounding.prev,
      surrounding.next,
      now,
      cut.maxCurrentKnots
    )
    heightFt = interpolateTideHeight(surrounding.prev, surrounding.next, now)
  }

  const nextEvt = getNextEvent(adjusted, now)
  const wind = getWindAtTime(windData, now)

  const windSpeed = wind?.speedKnots ?? 0
  const windGust = wind?.gustKnots ?? 0
  const windDir = wind?.directionDeg ?? 0

  const opposing = isWindAgainstCurrent(direction, windDir, windSpeed)
  const { level, reasons } = assessSafety(
    direction,
    currentSpeed,
    windSpeed,
    windDir,
    windGust
  )

  const nextSlack = getNextSlackWindow(adjusted, now)
  let minutesToSlack: number | null = null
  if (nextSlack) {
    if (now >= nextSlack.start && now <= nextSlack.end) {
      minutesToSlack = 0
    } else {
      minutesToSlack = differenceInMinutes(nextSlack.start, now)
    }
  }

  // Find best daylight transit window
  const daylightWindows = getDaylightSlackWindows(adjusted, now)
  let bestDaylightWindow: CutStatus['bestDaylightWindow'] = null
  if (daylightWindows.length > 0) {
    const dw = daylightWindows[0]
    const typeLabel = dw.type === 'H' ? 'high' : 'low'
    bestDaylightWindow = {
      start: dw.start,
      end: dw.end,
      type: dw.type,
      label: `${format(dw.start, 'h:mm')}–${format(dw.end, 'h:mm a')} (${typeLabel} slack)`,
    }
  }

  // Depth calculations for depth-critical cuts
  let depthNowFt: number | null = null
  let nextHighTide: CutStatus['nextHighTide'] = null

  if (cut.depthCritical && cut.mlwDepthFt != null) {
    // Depth = base MLW depth + current tide height above MLLW
    // NOAA heights are relative to MLLW, so negative values = below MLLW
    depthNowFt = cut.mlwDepthFt + heightFt

    // Find the next high tide
    const nowMs = now.getTime()
    const futureHighs = adjusted.filter(
      (e) => e.type === 'H' && e.time.getTime() > nowMs
    )
    if (futureHighs.length > 0) {
      const nh = futureHighs[0]
      nextHighTide = {
        time: nh.time,
        heightFt: nh.height,
        depthFt: cut.mlwDepthFt + nh.height,
        minutesAway: differenceInMinutes(nh.time, now),
      }
    }
  }

  return {
    cut,
    tideDirection: direction,
    currentSpeedKnots: currentSpeed,
    heightFt,
    nextEventType: nextEvt?.type ?? 'H',
    nextEventTime: nextEvt?.time ?? now,
    nextEventHeight: nextEvt?.height ?? 0,
    minutesToNextEvent: nextEvt
      ? differenceInMinutes(nextEvt.time, now)
      : 0,
    isSlackWindow: direction === 'slack',
    windSpeedKnots: windSpeed,
    windGustKnots: windGust,
    windDirectionDeg: windDir,
    windDirectionCardinal: degreesToCardinal(windDir),
    isWindAgainstCurrent: opposing,
    safetyLevel: level,
    safetyReasons: reasons,
    nextSlackStart: nextSlack?.start ?? null,
    nextSlackEnd: nextSlack?.end ?? null,
    minutesToSlack,
    bestDaylightWindow,
    depthNowFt,
    nextHighTide,
  }
}

export function useAllCutStatuses(
  cuts: CutDefinition[],
  nassauTides: HiLo[] | null,
  windData: WindHourly[] | null,
  now: Date
): CutStatus[] {
  return useMemo(() => {
    if (!nassauTides || !windData) return []
    return cuts.map((cut) =>
      computeCutStatus(cut, nassauTides, windData, now)
    )
  }, [cuts, nassauTides, windData, now])
}
