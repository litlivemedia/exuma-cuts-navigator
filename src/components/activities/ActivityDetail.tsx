import { format } from 'date-fns'
import type { Activity, ActivityCondition } from '../../types/activity.ts'
import type { HiLo } from '../../types/tide.ts'
import type { WindHourly } from '../../types/wind.ts'
import { getActivityTripWindows } from '../../services/activityEngine.ts'

const conditionCfg: Record<ActivityCondition, { dot: string; label: string; text: string; bg: string }> = {
  ideal: { dot: 'bg-emerald-500', label: 'Ideal', text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  good: { dot: 'bg-sky-500', label: 'Good', text: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' },
  fair: { dot: 'bg-amber-500', label: 'Fair', text: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  poor: { dot: 'bg-slate-400', label: 'Poor', text: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
}

export function ActivityDetail({
  activity,
  condition,
  reasons,
  tides,
  wind,
  now,
  offsetMinutes,
  onBack,
}: {
  activity: Activity
  condition: ActivityCondition
  reasons: string[]
  tides: HiLo[]
  wind: WindHourly[]
  now: Date
  offsetMinutes: number
  onBack: () => void
}) {
  const tripWindows = getActivityTripWindows(activity, tides, wind, now, offsetMinutes)
  const cfg = conditionCfg[condition]

  return (
    <div className="min-h-screen bg-sky-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-sky-900 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-sky-300 text-sm font-medium flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Activities
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span className={`text-sm font-semibold ${condition === 'ideal' ? 'text-emerald-300' : condition === 'good' ? 'text-sky-300' : condition === 'fair' ? 'text-amber-300' : 'text-slate-300'}`}>
              {cfg.label}
            </span>
          </div>
        </div>
        <div className="mt-1">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <span>{activity.icon}</span>
            {activity.name}
          </h1>
          <p className="text-sky-300 text-xs">{activity.subtitle}</p>
        </div>
      </header>

      <div className="p-4 space-y-4 pb-24">
        {/* Current conditions banner */}
        <div className={`rounded-xl border p-3 ${cfg.bg}`}>
          <p className={`text-sm font-semibold ${cfg.text} mb-1`}>
            Current Conditions: {cfg.label}
          </p>
          {reasons.map((r, i) => (
            <p key={i} className="text-xs text-slate-600 mt-0.5">• {r}</p>
          ))}
        </div>

        {/* Trip Planner */}
        {tripWindows.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Trip Planner</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {(() => {
                let lastDay = ''
                return tripWindows.slice(0, 8).map((w, i) => {
                  const showDay = w.dayLabel !== lastDay
                  lastDay = w.dayLabel
                  const windowCfg = conditionCfg[w.condition]
                  const isPast = w.end < now
                  const isActive = w.start <= now && w.end >= now
                  return (
                    <div key={i}>
                      {showDay && (
                        <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-600">{w.dayLabel}</span>
                        </div>
                      )}
                      <div className={`px-3 py-2.5 flex items-center justify-between border-b border-slate-50 ${isPast ? 'opacity-40' : ''} ${isActive ? 'bg-emerald-50/50' : ''}`}>
                        <div>
                          <span className={`text-sm font-semibold ${isActive ? 'text-emerald-700' : 'text-slate-900'}`}>
                            {format(w.start, 'h:mm a')} – {format(w.end, 'h:mm a')}
                          </span>
                          {isActive && (
                            <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">NOW</span>
                          )}
                          <p className="text-xs text-slate-500 mt-0.5">{w.label}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${windowCfg.dot}`} />
                          <span className={`text-xs font-semibold ${windowCfg.text}`}>{windowCfg.label}</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </section>
        )}

        {/* Overview */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Overview</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{activity.guide.overview}</p>
        </section>

        {/* Getting There */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Getting There</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{activity.guide.gettingThere}</p>
          {activity.gpxFile && (
            <a
              href={activity.gpxFile}
              download
              className="inline-flex items-center gap-2 mt-3 bg-sky-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl active:bg-sky-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download GPX Track
            </a>
          )}
        </section>

        {/* Best Conditions */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Best Conditions</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{activity.guide.bestConditions}</p>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Tips</h2>
          <ul className="space-y-2">
            {activity.guide.tips.map((tip, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>

        {/* Warnings */}
        {activity.guide.warnings.length > 0 && (
          <section>
            <h2 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-2">Cautions</h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <ul className="space-y-2">
                {activity.guide.warnings.map((w, i) => (
                  <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Location */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Location</h2>
          <p className="text-sm text-slate-500">
            {Math.abs(activity.lat).toFixed(3)}°{activity.lat >= 0 ? 'N' : 'S'},{' '}
            {Math.abs(activity.lon).toFixed(3)}°{activity.lon < 0 ? 'W' : 'E'}
          </p>
        </section>
      </div>
    </div>
  )
}
