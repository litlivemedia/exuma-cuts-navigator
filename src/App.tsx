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
        marineData={marine ?? []}
        now={now}
        onBack={() => setSelectedCutId(null)}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen min-h-[100dvh] bg-sky-50">
      {/* Header */}
      <header className="bg-sky-900 text-white pl-4 pr-6 pt-3 pb-0">
        <div className="flex items-center gap-2">
          {/* Compass rose icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-sky-300 flex-shrink-0">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="12,2.5 13.5,10 12,8 10.5,10" fill="currentColor" opacity="0.9" />
            <polygon points="12,21.5 10.5,14 12,16 13.5,14" fill="currentColor" opacity="0.4" />
            <polygon points="2.5,12 10,10.5 8,12 10,13.5" fill="currentColor" opacity="0.4" />
            <polygon points="21.5,12 14,13.5 16,12 14,10.5" fill="currentColor" opacity="0.4" />
          </svg>
          <div>
            <h1 className="text-lg font-bold tracking-tight">The Cut Navigator</h1>
            <p className="text-sky-300/80 text-[11px] -mt-0.5 tracking-wide uppercase">Exumas &amp; Ragged Islands</p>
          </div>
        </div>
        <p className="text-sky-300 text-xs mt-1">
          {format(now, 'EEEE, MMM d')} &middot; {format(now, 'h:mm a')}
          {!isOnline && (
            <span className="ml-2 text-amber-300">Offline</span>
          )}
        </p>
        <ShipwreckFact />

        {/* Top tab bar */}
        <nav className="flex mt-3 -mx-4 -mr-6">
          {([
            { id: 'list' as TabId, label: 'Cuts' },
            { id: 'map' as TabId, label: 'Map' },
            { id: 'settings' as TabId, label: 'Info' },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'text-white border-b-2 border-white'
                  : 'text-sky-300/70 border-b-2 border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
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
              <ListView statuses={statuses} onSelect={handleSelectCut} dailyForecasts={dailyForecasts} marineData={marine ?? []} />
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

      {/* Bottom nav kept for thumb-reach on mobile */}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
