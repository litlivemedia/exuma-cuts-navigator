import { useState, useEffect, useMemo } from 'react'
import type { MarineHourly, MarineDaily } from '../types/marine.ts'
import type { WindHourly } from '../types/wind.ts'
import { fetchMarineForecast, buildDailyForecasts } from '../services/marine.ts'
import { getCachedMarine, cacheMarine } from '../services/cache.ts'

interface UseMarineResult {
  marine: MarineHourly[] | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useMarine(): UseMarineResult {
  const [marine, setMarine] = useState<MarineHourly[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const cached = await getCachedMarine()
      if (cached && !cancelled) {
        setMarine(cached)
        setLoading(false)
      }

      try {
        const fresh = await fetchMarineForecast()
        if (!cancelled) {
          setMarine(fresh)
          await cacheMarine(fresh)
        }
      } catch (err) {
        if (!cancelled && !cached) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch marine data'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [refreshKey])

  return {
    marine,
    loading,
    error,
    refresh: () => setRefreshKey((k) => k + 1),
  }
}

/** Combine marine + wind into daily summaries */
export function useDailyForecasts(
  marine: MarineHourly[] | null,
  wind: WindHourly[] | null,
  now: Date,
): MarineDaily[] {
  return useMemo(() => {
    if (!marine || !wind) return []
    return buildDailyForecasts(marine, wind, now)
  }, [marine, wind, now])
}
