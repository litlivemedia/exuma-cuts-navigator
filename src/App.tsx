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
import { ActivitiesView } from './pages/ActivitiesView.tsx'
import { SettingsView } from './pages/SettingsView.tsx'
import { CutDetail } from './components/cuts/CutDetail.tsx'
import { ActivityDetail } from './components/activities/ActivityDetail.tsx'
import { Loading } from './components/common/Loading.tsx'
import { ShipwreckFact } from './components/fun/ShipwreckFact.tsx'
import { activities } from './data/activities.ts'
import { assessActivity } from './services/activityEngine.ts'

function App() {
  const [tab, setTab] = useState<TabId>('list')
  const [selectedCut, setSelectedCut] = useState<{ id: string; showReport?: boolean } | null>(null)
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
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

  const handleSelectCut = useCallback((id: string, showReport?: boolean) => {
    setSelectedCut({ id, showReport })
  }, [])

  const selectedStatus = statuses.find((s) => s.cut.id === selectedCut?.id)

  const loading = tidesLoading || windLoading
  const error = tidesError || windError

  // Activity detail view
  if (selectedActivityId && tides && wind) {
    const activity = activities.find((a) => a.id === selectedActivityId)
    if (activity) {
      const cut = cuts.find((c) => c.id === activity.nearestCutId)
      const offset = cut?.offsetMinutes ?? 0
      const assessment = assessActivity(activity, tides, wind, now, offset)
      return (
        <ActivityDetail
          activity={activity}
          condition={assessment.condition}
          reasons={assessment.reasons}
          onBack={() => setSelectedActivityId(null)}
        />
      )
    }
  }

  // Detail view
  if (selectedCut && selectedStatus && tides && wind) {
    return (
      <CutDetail
        status={selectedStatus}
        nassauTides={tides}
        windData={wind}
        marineData={marine ?? []}
        now={now}
        onBack={() => setSelectedCut(null)}
        initialShowReport={selectedCut.showReport}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen min-h-[100dvh] bg-sky-50">
      {/* Header */}
      <header className="bg-sky-900 text-white pl-4 pr-6 pt-3 pb-0">
        <div className="flex items-center gap-3">
          {/* Compass rose icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <circle cx="12" cy="12" r="10" stroke="#7dd3fc" strokeWidth="1" opacity="0.5" />
            <circle cx="12" cy="12" r="6.5" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.3" />
            {/* N — red */}
            <polygon points="12,2 13.8,10 12,7.5 10.2,10" fill="#f87171" />
            {/* S — white */}
            <polygon points="12,22 10.2,14 12,16.5 13.8,14" fill="#e2e8f0" opacity="0.5" />
            {/* E — white */}
            <polygon points="22,12 14,13.8 16.5,12 14,10.2" fill="#e2e8f0" opacity="0.5" />
            {/* W — white */}
            <polygon points="2,12 10,10.2 7.5,12 10,13.8" fill="#e2e8f0" opacity="0.5" />
            <circle cx="12" cy="12" r="1.2" fill="#fbbf24" />
          </svg>
          <div>
            <h1 className="text-xl font-bold tracking-tight">The Cut Navigator</h1>
            <p className="text-sky-300 text-xs tracking-wide uppercase">Exumas &amp; Ragged Islands</p>
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
            { id: 'activities' as TabId, label: 'Activities' },
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
            {tab === 'activities' && (
              <ActivitiesView tides={tides} wind={wind} now={now} onSelect={setSelectedActivityId} />
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
