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
 * Each cut has its own bearing (degrees true) from Bank side toward Exuma Sound.
 * Ebbing: current flows along that bearing (out to Exuma Sound).
 * Flooding: current flows along the reciprocal (onto the Bank).
 *
 * Wind direction is meteorological: direction wind comes FROM.
 * Wind FROM the same direction as the ebb bearing means waves travel
 * opposite to the ebb current — the classic wind-against-current hazard.
 */
export function isWindAgainstCurrent(
  currentDirection: TideDirection,
  windDirectionDeg: number,
  windSpeedKnots: number,
  cutBearingDeg: number = 55
): boolean {
  if (currentDirection === 'slack') return false
  if (windSpeedKnots < WIND_OPPOSING_MIN_KNOTS) return false

  // Ebb flows along the cut bearing; flood flows the reciprocal
  const currentFlowDeg = currentDirection === 'ebbing'
    ? cutBearingDeg
    : (cutBearingDeg + 180) % 360

  // Wind FROM direction vs current FLOW direction
  // When wind comes FROM the same direction as current flow,
  // the waves travel opposite to the current → standing waves
  const angleDiff = Math.abs(windDirectionDeg - currentFlowDeg)
  const normalizedDiff = angleDiff > 180 ? 360 - angleDiff : angleDiff

  return normalizedDiff <= 90
}

export function assessSafety(
  currentDirection: TideDirection,
  currentSpeedKnots: number,
  windSpeedKnots: number,
  windDirectionDeg: number,
  windGustKnots: number,
  cutBearingDeg: number = 55
): { level: SafetyLevel; reasons: string[] } {
  const reasons: string[] = []
  const opposing = isWindAgainstCurrent(
    currentDirection,
    windDirectionDeg,
    windSpeedKnots,
    cutBearingDeg
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
