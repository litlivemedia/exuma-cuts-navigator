import type { WindHourly, OpenMeteoResponse } from '../types/wind.ts'
import {
  OPEN_METEO_API_BASE,
  WIND_FETCH_LAT,
  WIND_FETCH_LON,
} from '../data/constants.ts'

export async function fetchWind(): Promise<WindHourly[]> {
  const params = new URLSearchParams({
    latitude: WIND_FETCH_LAT.toString(),
    longitude: WIND_FETCH_LON.toString(),
    hourly: 'wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    forecast_days: '3',
    timezone: 'America/Nassau',
    wind_speed_unit: 'kn',
  })

  const response = await fetch(`${OPEN_METEO_API_BASE}?${params}`)
  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`)
  }

  const data: OpenMeteoResponse = await response.json()
  const { time, wind_speed_10m, wind_direction_10m, wind_gusts_10m } =
    data.hourly

  return time.map((t, i) => ({
    time: new Date(t),
    speedKnots: wind_speed_10m[i],
    directionDeg: wind_direction_10m[i],
    gustKnots: wind_gusts_10m[i],
  }))
}

export function getWindAtTime(
  windData: WindHourly[],
  targetTime: Date
): WindHourly | null {
  if (windData.length === 0) return null

  const targetMs = targetTime.getTime()
  let closest = windData[0]
  let closestDiff = Math.abs(targetMs - closest.time.getTime())

  for (const w of windData) {
    const diff = Math.abs(targetMs - w.time.getTime())
    if (diff < closestDiff) {
      closest = w
      closestDiff = diff
    }
  }

  return closest
}

export function degreesToCardinal(deg: number): string {
  const dirs = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ]
  const index = Math.round(((deg % 360) + 360) % 360 / 22.5) % 16
  return dirs[index]
}
