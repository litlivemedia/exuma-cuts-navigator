import { startOfDay, addDays, format } from 'date-fns'
import type { MarineHourly, MarineDaily, MarineApiResponse } from '../types/marine.ts'
import type { WindHourly } from '../types/wind.ts'
import { WIND_FETCH_LAT, WIND_FETCH_LON } from '../data/constants.ts'
import { degreesToCardinal } from './wind.ts'

const MARINE_API_BASE = 'https://marine-api.open-meteo.com/v1/marine'
const METERS_TO_FEET = 3.28084

// ── Fetch ──────────────────────────────────────────────────────

export async function fetchMarineForecast(): Promise<MarineHourly[]> {
  const params = new URLSearchParams({
    latitude: WIND_FETCH_LAT.toString(),
    longitude: WIND_FETCH_LON.toString(),
    hourly: 'wave_height,wave_period,wave_direction,wind_wave_height,swell_wave_height',
    forecast_days: '3',
    timezone: 'America/Nassau',
  })

  const response = await fetch(`${MARINE_API_BASE}?${params}`)
  if (!response.ok) {
    throw new Error(`Marine API error: ${response.status}`)
  }

  const data: MarineApiResponse = await response.json()
  const { time, wave_height, wave_period, wave_direction, wind_wave_height, swell_wave_height } = data.hourly

  return time.map((t, i) => ({
    time: new Date(t),
    waveHeightFt: (wave_height[i] ?? 0) * METERS_TO_FEET,
    wavePeriodSec: wave_period[i] ?? 0,
    waveDirectionDeg: wave_direction[i] ?? 0,
    windWaveHeightFt: (wind_wave_height[i] ?? 0) * METERS_TO_FEET,
    swellHeightFt: (swell_wave_height[i] ?? 0) * METERS_TO_FEET,
  }))
}

// ── Aggregate to daily ─────────────────────────────────────────

function assessSeaState(maxWaveFt: number, maxGustKnots: number): MarineDaily['seaState'] {
  // Combination of wave height and wind gusts
  if (maxWaveFt >= 8 || maxGustKnots >= 35) return 'very rough'
  if (maxWaveFt >= 5 || maxGustKnots >= 25) return 'rough'
  if (maxWaveFt >= 3 || maxGustKnots >= 18) return 'moderate'
  if (maxWaveFt >= 1.5) return 'light'
  return 'calm'
}

function buildWarning(
  seaState: MarineDaily['seaState'],
  maxWaveFt: number,
  maxGustKnots: number,
  maxWindKnots: number,
): { isWarning: boolean; warningText: string | null } {
  if (seaState === 'very rough') {
    return {
      isWarning: true,
      warningText: `Dangerous conditions — waves to ${maxWaveFt.toFixed(0)}ft, gusts ${Math.round(maxGustKnots)}kts. Do not transit cuts.`,
    }
  }
  if (seaState === 'rough') {
    return {
      isWarning: true,
      warningText: `Rough seas — waves to ${maxWaveFt.toFixed(0)}ft, wind ${Math.round(maxWindKnots)}kts gusting ${Math.round(maxGustKnots)}kts. Use extreme caution.`,
    }
  }
  if (seaState === 'moderate' && maxGustKnots >= 22) {
    return {
      isWarning: true,
      warningText: `Gusty winds to ${Math.round(maxGustKnots)}kts with ${maxWaveFt.toFixed(0)}ft seas. Choose slack windows carefully.`,
    }
  }
  return { isWarning: false, warningText: null }
}

export function buildDailyForecasts(
  marine: MarineHourly[],
  wind: WindHourly[],
  now: Date,
): MarineDaily[] {
  const today = startOfDay(now)

  const dayDefs = [
    { date: today, label: 'Today' },
    { date: addDays(today, 1), label: 'Tomorrow' },
    { date: addDays(today, 2), label: format(addDays(today, 2), 'EEEE') },
  ]

  return dayDefs.map(({ date, label }) => {
    const dayStart = date.getTime()

    // Only use daylight hours (6am-7pm) for the summary to reflect transit conditions
    const daylightStart = dayStart + 6 * 3600000
    const daylightEnd = dayStart + 19 * 3600000

    const dayMarine = marine.filter(
      (m) => m.time.getTime() >= daylightStart && m.time.getTime() < daylightEnd
    )
    const dayWind = wind.filter(
      (w) => w.time.getTime() >= daylightStart && w.time.getTime() < daylightEnd
    )

    const maxWave = dayMarine.length > 0
      ? Math.max(...dayMarine.map((m) => m.waveHeightFt))
      : 0
    const maxWindWave = dayMarine.length > 0
      ? Math.max(...dayMarine.map((m) => m.windWaveHeightFt))
      : 0
    const maxSwell = dayMarine.length > 0
      ? Math.max(...dayMarine.map((m) => m.swellHeightFt))
      : 0
    const avgPeriod = dayMarine.length > 0
      ? dayMarine.reduce((s, m) => s + m.wavePeriodSec, 0) / dayMarine.length
      : 0
    const dominantDir = dayMarine.length > 0
      ? dayMarine[Math.floor(dayMarine.length / 2)].waveDirectionDeg
      : 0

    const maxWindSpeed = dayWind.length > 0
      ? Math.max(...dayWind.map((w) => w.speedKnots))
      : 0
    const maxGust = dayWind.length > 0
      ? Math.max(...dayWind.map((w) => w.gustKnots))
      : 0

    // Use midday wind for "average" direction
    const middayWind = dayWind.length > 0
      ? dayWind[Math.floor(dayWind.length / 2)]
      : null
    const avgWindDir = middayWind?.directionDeg ?? 0

    const seaState = assessSeaState(maxWave, maxGust)
    const { isWarning, warningText } = buildWarning(seaState, maxWave, maxGust, maxWindSpeed)

    return {
      date,
      label,
      maxWaveHeightFt: maxWave,
      maxWindWaveHeightFt: maxWindWave,
      maxSwellHeightFt: maxSwell,
      avgWavePeriodSec: avgPeriod,
      dominantWaveDirectionDeg: dominantDir,
      maxWindSpeedKnots: maxWindSpeed,
      maxGustKnots: maxGust,
      avgWindDirectionDeg: avgWindDir,
      avgWindCardinal: degreesToCardinal(avgWindDir),
      seaState,
      isWarning,
      warningText,
    }
  })
}
