import type { TideDirection } from '../types/tide.ts'
import type { SafetyLevel } from '../types/cut.ts'
import {
  WIND_OPPOSING_MIN_KNOTS,
  WIND_HAZARDOUS_KNOTS,
  WIND_CAUTION_STRONG_KNOTS,
  GUST_HAZARDOUS_KNOTS,
  CURRENT_HAZARDOUS_KNOTS,
  CURRENT_CAUTION_KNOTS,
} from '../data/constants.ts'

/**
 * All Exuma cuts run roughly E-W.
 * Ebbing: current flows east (out to Exuma Sound) ~90 degrees
 * Flooding: current flows west (onto Great Bahama Bank) ~270 degrees
 *
 * Wind direction is meteorological: direction wind comes FROM.
 * Wind FROM east (90) opposes current FLOWING east (ebbing).
 */
export function isWindAgainstCurrent(
  currentDirection: TideDirection,
  windDirectionDeg: number,
  windSpeedKnots: number
): boolean {
  if (currentDirection === 'slack') return false
  if (windSpeedKnots < WIND_OPPOSING_MIN_KNOTS) return false

  const currentFlowDeg = currentDirection === 'ebbing' ? 90 : 270

  // Wind FROM direction vs current FLOW direction
  // Wind FROM east (90) opposes current flowing east (90)
  const angleDiff = Math.abs(windDirectionDeg - currentFlowDeg)
  const normalizedDiff = angleDiff > 180 ? 360 - angleDiff : angleDiff

  return normalizedDiff <= 90
}

export function assessSafety(
  currentDirection: TideDirection,
  currentSpeedKnots: number,
  windSpeedKnots: number,
  windDirectionDeg: number,
  windGustKnots: number
): { level: SafetyLevel; reasons: string[] } {
  const reasons: string[] = []
  const opposing = isWindAgainstCurrent(
    currentDirection,
    windDirectionDeg,
    windSpeedKnots
  )

  // HAZARDOUS: wind opposing current with significant force
  if (opposing && (windSpeedKnots >= WIND_HAZARDOUS_KNOTS || currentSpeedKnots >= CURRENT_HAZARDOUS_KNOTS)) {
    reasons.push('Wind opposing current — dangerous standing waves likely')
    if (windSpeedKnots >= WIND_HAZARDOUS_KNOTS) {
      reasons.push(`Wind ${Math.round(windSpeedKnots)} kts against current`)
    }
    if (currentSpeedKnots >= CURRENT_HAZARDOUS_KNOTS) {
      reasons.push(`Strong current ${currentSpeedKnots.toFixed(1)} kts`)
    }
    return { level: 'hazardous', reasons }
  }

  if (opposing && windGustKnots >= GUST_HAZARDOUS_KNOTS) {
    reasons.push(`Wind gusts ${Math.round(windGustKnots)} kts opposing current`)
    return { level: 'hazardous', reasons }
  }

  // CAUTION: moderate wind opposing current
  if (opposing) {
    reasons.push('Wind opposing current — moderate chop possible')
    return { level: 'caution', reasons }
  }

  // CAUTION: very strong current regardless of wind
  if (currentSpeedKnots >= CURRENT_CAUTION_KNOTS) {
    reasons.push(`Strong current ${currentSpeedKnots.toFixed(1)} kts`)
    return { level: 'caution', reasons }
  }

  // CAUTION: strong wind with flowing current
  if (windSpeedKnots >= WIND_CAUTION_STRONG_KNOTS && currentDirection !== 'slack') {
    reasons.push(`Strong wind ${Math.round(windSpeedKnots)} kts with active current`)
    return { level: 'caution', reasons }
  }

  // SAFE
  if (currentDirection === 'slack') {
    reasons.push('Slack water — minimal current')
  } else {
    reasons.push('Conditions favorable for transit')
  }
  return { level: 'safe', reasons }
}
