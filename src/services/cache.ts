import { get, set } from 'idb-keyval'
import type { HiLo } from '../types/tide.ts'
import type { WindHourly } from '../types/wind.ts'
import type { MarineHourly } from '../types/marine.ts'
import { TIDE_CACHE_MAX_AGE, WIND_CACHE_MAX_AGE, MARINE_CACHE_MAX_AGE } from '../data/constants.ts'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export async function getCachedTides(): Promise<HiLo[] | null> {
  const entry = await get<CacheEntry<HiLo[]>>('tides')
  if (!entry) return null
  if (Date.now() - entry.timestamp > TIDE_CACHE_MAX_AGE) return null
  // Restore Date objects from serialized strings
  return entry.data.map((h) => ({ ...h, time: new Date(h.time) }))
}

export async function cacheTides(data: HiLo[]): Promise<void> {
  await set('tides', { data, timestamp: Date.now() })
}

export async function getCachedWind(): Promise<WindHourly[] | null> {
  const entry = await get<CacheEntry<WindHourly[]>>('wind')
  if (!entry) return null
  if (Date.now() - entry.timestamp > WIND_CACHE_MAX_AGE) return null
  return entry.data.map((w) => ({ ...w, time: new Date(w.time) }))
}

export async function cacheWind(data: WindHourly[]): Promise<void> {
  await set('wind', { data, timestamp: Date.now() })
}

export async function getCachedMarine(): Promise<MarineHourly[] | null> {
  const entry = await get<CacheEntry<MarineHourly[]>>('marine')
  if (!entry) return null
  if (Date.now() - entry.timestamp > MARINE_CACHE_MAX_AGE) return null
  return entry.data.map((m) => ({ ...m, time: new Date(m.time) }))
}

export async function cacheMarine(data: MarineHourly[]): Promise<void> {
  await set('marine', { data, timestamp: Date.now() })
}

export async function getCacheTimestamp(
  key: string
): Promise<number | null> {
  const entry = await get<CacheEntry<unknown>>(key)
  return entry?.timestamp ?? null
}
