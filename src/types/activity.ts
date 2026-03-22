export type ActivityCondition = 'ideal' | 'good' | 'fair' | 'poor'

export interface TideWindow {
  /** Hours relative to high tide. Negative = before high, positive = after high. */
  relativeToHigh: [number, number]
}

export interface Activity {
  id: string
  name: string
  subtitle: string
  lat: number
  lon: number
  /** Nearest cut ID for tide offset reference */
  nearestCutId: string
  /** Description paragraphs for the detail/guide page */
  guide: {
    overview: string
    gettingThere: string
    bestConditions: string
    tips: string[]
    warnings: string[]
  }
  /** Tide window relative to high tide (hours before/after) */
  tideWindow?: TideWindow
  /** True if activity is better with stronger currents (e.g., washing machine) */
  bestWithStrongCurrent?: boolean
  /** True if activity needs rough seas / waves crashing */
  bestWithRoughSeas?: boolean
  /** Preferred wave/wind direction for rough-sea activities (degrees) */
  preferredWindDirRange?: [number, number]
  /** GPX track file path (relative to /public) */
  gpxFile?: string
  /** Emoji icon for the card */
  icon: string
}
