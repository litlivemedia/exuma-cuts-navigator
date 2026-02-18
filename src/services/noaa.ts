import { format, addDays } from 'date-fns'
import type { HiLo, NOAAResponse } from '../types/tide.ts'
import { NASSAU_STATION_ID, NOAA_API_BASE } from '../data/constants.ts'

export async function fetchNassauTides(date: Date): Promise<HiLo[]> {
  const beginDate = format(date, 'yyyyMMdd')
  const endDate = format(addDays(date, 3), 'yyyyMMdd')

  const params = new URLSearchParams({
    begin_date: beginDate,
    end_date: endDate,
    station: NASSAU_STATION_ID,
    product: 'predictions',
    datum: 'MLLW',
    time_zone: 'lst_ldt',
    interval: 'hilo',
    units: 'english',
    format: 'json',
    application: 'ExumaCutsNavigator',
  })

  const response = await fetch(`${NOAA_API_BASE}?${params}`)
  if (!response.ok) {
    throw new Error(`NOAA API error: ${response.status}`)
  }

  const data: NOAAResponse = await response.json()
  if (!data.predictions || data.predictions.length === 0) {
    throw new Error('No tide predictions returned from NOAA')
  }

  return data.predictions.map((p) => ({
    time: new Date(p.t.replace(' ', 'T')),
    height: parseFloat(p.v),
    type: p.type,
  }))
}
