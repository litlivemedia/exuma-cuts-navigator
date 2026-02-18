import { useState, useEffect } from 'react'
import type { HiLo } from '../types/tide.ts'
import { fetchNassauTides } from '../services/noaa.ts'
import { getCachedTides, cacheTides } from '../services/cache.ts'

interface UseTidesResult {
  tides: HiLo[] | null
  loading: boolean
  error: string | null
  lastFetched: Date | null
  refresh: () => void
}

export function useTides(): UseTidesResult {
  const [tides, setTides] = useState<HiLo[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      // Try cache first
      const cached = await getCachedTides()
      if (cached && !cancelled) {
        setTides(cached)
        setLoading(false)
      }

      // Fetch fresh data
      try {
        const fresh = await fetchNassauTides(new Date())
        if (!cancelled) {
          setTides(fresh)
          setLastFetched(new Date())
          await cacheTides(fresh)
        }
      } catch (err) {
        if (!cancelled) {
          if (!cached) {
            setError(
              err instanceof Error ? err.message : 'Failed to fetch tide data'
            )
          }
          // If we have cache, keep using it silently
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [refreshKey])

  return {
    tides,
    loading,
    error,
    lastFetched,
    refresh: () => setRefreshKey((k) => k + 1),
  }
}
