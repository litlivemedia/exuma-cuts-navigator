import { useState, useEffect } from 'react'
import type { WindHourly } from '../types/wind.ts'
import { fetchWind } from '../services/wind.ts'
import { getCachedWind, cacheWind } from '../services/cache.ts'

interface UseWindResult {
  wind: WindHourly[] | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export function useWind(): UseWindResult {
  const [wind, setWind] = useState<WindHourly[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const cached = await getCachedWind()
      if (cached && !cancelled) {
        setWind(cached)
        setLoading(false)
      }

      try {
        const fresh = await fetchWind()
        if (!cancelled) {
          setWind(fresh)
          await cacheWind(fresh)
        }
      } catch (err) {
        if (!cancelled && !cached) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch wind data'
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
    wind,
    loading,
    error,
    refresh: () => setRefreshKey((k) => k + 1),
  }
}
