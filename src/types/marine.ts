export interface MarineHourly {
  time: Date
  waveHeightFt: number
  wavePeriodSec: number
  waveDirectionDeg: number
  windWaveHeightFt: number
  swellHeightFt: number
}

export interface MarineDaily {
  date: Date
  label: string // "Today", "Tomorrow", "Wednesday"
  maxWaveHeightFt: number
  maxWindWaveHeightFt: number
  maxSwellHeightFt: number
  avgWavePeriodSec: number
  dominantWaveDirectionDeg: number
  /** Derived from wind data for the same day */
  maxWindSpeedKnots: number
  maxGustKnots: number
  avgWindDirectionDeg: number
  avgWindCardinal: string
  /** Sea state assessment */
  seaState: 'calm' | 'light' | 'moderate' | 'rough' | 'very rough'
  /** Is this a warning day? */
  isWarning: boolean
  warningText: string | null
}

export interface MarineApiResponse {
  hourly: {
    time: string[]
    wave_height: number[]
    wave_period: number[]
    wave_direction: number[]
    wind_wave_height: number[]
    swell_wave_height: number[]
  }
}
