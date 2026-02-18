import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { cuts } from './data/cuts.ts'
import { useTides } from './hooks/useTides.ts'
import { useWind } from './hooks/useWind.ts'
import { useMarine, useDailyForecasts } from './hooks/useMarine.ts'
import { useAllCutStatuses } from './hooks/useCutStatus.ts'
import { BottomNav, type TabId } from './components/layout/BottomNav.tsx'
import { ListView } from './pages/ListView.tsx'
import { MapView } from './pages/MapView.tsx'
import { SettingsView } from './pages/SettingsView.tsx'
import { CutDetail } from './components/cuts/CutDetail.tsx'
import { Loading } from './components/common/Loading.tsx'
import { ShipwreckFact } from './components/fun/ShipwreckFact.tsx'

function App() {
  const [tab, setTab] = useState<TabId>('list')
  const [selectedCutId, setSelectedCutId] = useState<string | null>(null)
  const [now, setNow] = useState(new Date())
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const { tides, loading: tidesLoading, error: tidesError, lastFetched: lastTideFetch, refresh: refreshTides } = useTides()
  const { wind, loading: windLoading, error: windError, refresh: refreshWind } = useWind()
  const { marine, refresh: refreshMarine } = useMarine()
  const dailyForecasts = useDailyForecasts(marine, wind, now)

  // Update clock every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const statuses = useAllCutStatuses(cuts, tides, wind, now)

  const handleRefresh = useCallback(() => {
    refreshTides()
    refreshWind()
    refreshMarine()
  }, [refreshTides, refreshWind, refreshMarine])

  const handleSelectCut = useCallback((id: string) => {
    setSelectedCutId(id)
  }, [])

  const selectedStatus = statuses.find((s) => s.cut.id === selectedCutId)

  const loading = tidesLoading || windLoading
  const error = tidesError || windError

  // Detail view
  if (selectedCutId && selectedStatus && tides && wind) {
    return (
      <CutDetail
        status={selectedStatus}
        nassauTides={tides}
        windData={wind}
        now={now}
        onBack={() => setSelectedCutId(null)}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen min-h-[100dvh] bg-sky-50">
      {/* Header */}
      <header className="bg-sky-900 text-white pl-4 pr-6 py-3">
        <h1 className="text-lg font-bold">Exuma Cuts Navigator</h1>
        <p className="text-sky-300 text-xs">
          {format(now, 'EEEE, MMM d')} &middot; {format(now, 'h:mm a')}
          {!isOnline && (
            <span className="ml-2 text-amber-300">Offline</span>
          )}
        </p>
        <ShipwreckFact />
      </header>

      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-800">
          Using cached data. Connect to refresh.
        </div>
      )}

      {/* Error */}
      {error && !loading && statuses.length === 0 && (
        <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <p className="font-semibold">Unable to load data</p>
          <p className="mt-1">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 bg-red-700 text-white text-xs font-medium rounded-lg px-4 py-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      <main className="flex-1">
        {loading && statuses.length === 0 ? (
          <Loading message="Fetching tide and wind data..." />
        ) : (
          <>
            {tab === 'list' && (
              <ListView statuses={statuses} onSelect={handleSelectCut} dailyForecasts={dailyForecasts} />
            )}
            {tab === 'map' && (
              <MapView statuses={statuses} onSelect={handleSelectCut} />
            )}
            {tab === 'settings' && (
              <SettingsView
                onRefresh={handleRefresh}
                lastTideFetch={lastTideFetch}
                lastWindFetch={null}
                isOnline={isOnline}
              />
            )}
          </>
        )}
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
