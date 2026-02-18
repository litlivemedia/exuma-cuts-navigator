import type { TideDirection } from './tide.ts'

export type SafetyLevel = 'safe' | 'caution' | 'hazardous'

export type CutGroup = 'exuma' | 'southern' | 'raggeds'

export interface CutDefinition {
  id: string
  name: string
  lat: number
  lon: number
  offsetMinutes: number
  maxCurrentKnots: number
  notes: string
  group: CutGroup
  /** Approximate bearing (degrees true) of the cut channel axis, measured
   *  from the Bahama Bank side toward Exuma Sound. Ebb current flows along
   *  this bearing; flood current flows the reciprocal. */
  bearingDeg: number
  /** Controlling depth at mean low water, in feet. Only for depth-critical cuts. */
  mlwDepthFt?: number
  /** If true, depth is the primary concern, not waves/current. */
  depthCritical?: boolean
}

export interface CutStatus {
  cut: CutDefinition
  tideDirection: TideDirection
  currentSpeedKnots: number
  heightFt: number
  nextEventType: 'H' | 'L'
  nextEventTime: Date
  nextEventHeight: number
  minutesToNextEvent: number
  isSlackWindow: boolean
  windSpeedKnots: number
  windGustKnots: number
  windDirectionDeg: number
  windDirectionCardinal: string
  isWindAgainstCurrent: boolean
  safetyLevel: SafetyLevel
  safetyReasons: string[]
  nextSlackStart: Date | null
  nextSlackEnd: Date | null
  minutesToSlack: number | null
  bestDaylightWindow: {
    start: Date
    end: Date
    type: 'H' | 'L'
    label: string
  } | null
  /** Estimated current depth in feet (mlwDepth + tide height). Only for depth-critical cuts. */
  depthNowFt: number | null
  /** Next high tide info for depth-critical cuts */
  nextHighTide: {
    time: Date
    heightFt: number
    depthFt: number
    minutesAway: number
  } | null
}
