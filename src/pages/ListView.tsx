import { useState } from 'react'
import type { CutStatus } from '../types/cut.ts'
import type { MarineDaily, MarineHourly } from '../types/marine.ts'
import { CutCard } from '../components/cuts/CutCard.tsx'
import { WeatherBriefing } from '../components/weather/WeatherBriefing.tsx'

export function ListView({
  statuses,
  onSelect,
  onActivities,
  dailyForecasts,
  marineData,
}: {
  statuses: CutStatus[]
  onSelect: (id: string, showReport?: boolean) => void
  onActivities?: () => void
  dailyForecasts: MarineDaily[]
  marineData: MarineHourly[]
}) {
  const exumaCuts = statuses.filter((s) => s.cut.group === 'exuma')
  const southernCuts = statuses.filter((s) => s.cut.group === 'southern')
  const raggedsCuts = statuses.filter((s) => s.cut.group === 'raggeds')

  const scrollSections = [
    ...(southernCuts.length > 0 ? [{ id: 'southern-section', label: 'Southern Exumas', count: southernCuts.length }] : []),
    ...(raggedsCuts.length > 0 ? [{ id: 'raggeds-section', label: 'The Raggeds', count: raggedsCuts.length }] : []),
  ]

  const [showIndex, setShowIndex] = useState(false)
  const allCuts = [...exumaCuts, ...southernCuts, ...raggedsCuts]

  const safetyDot: Record<string, string> = {
    safe: 'bg-emerald-500',
    caution: 'bg-amber-500',
    hazardous: 'bg-red-500',
  }

  return (
    <div className="pl-4 pr-6 py-4 pb-24 space-y-2 relative">
      {/* ═══ FLOATING CUT INDEX ═══ */}
      {showIndex && (
        <div className="fixed inset-0 z-40 flex" onClick={() => setShowIndex(false)}>
          <div
            className="w-64 bg-white shadow-2xl border-r border-slate-200 overflow-y-auto safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-3 py-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Quick Nav</span>
              <button onClick={() => setShowIndex(false)} className="text-slate-400 p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {[
              { label: 'Exuma Cuts', cuts: exumaCuts },
              { label: 'Southern Exumas', cuts: southernCuts },
              { label: 'The Raggeds', cuts: raggedsCuts },
            ].map((group) =>
              group.cuts.length > 0 && (
                <div key={group.label}>
                  <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{group.label}</span>
                  </div>
                  {group.cuts.map((s) => (
                    <button
                      key={s.cut.id}
                      onClick={() => {
                        setShowIndex(false)
                        document.getElementById(`cut-${s.cut.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 border-b border-slate-50 active:bg-sky-50 hover:bg-sky-50/50"
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${safetyDot[s.safetyLevel]}`} />
                      <span className="text-[13px] text-slate-700 truncate">{s.cut.name}</span>
                    </button>
                  ))}
                </div>
              )
            )}
          </div>
          <div className="flex-1 bg-black/30" />
        </div>
      )}

      {/* ═══ INDEX TOGGLE BUTTON ═══ */}
      <button
        onClick={() => setShowIndex(true)}
        className="fixed left-3 bottom-20 z-30 bg-sky-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg active:bg-sky-800"
        title="Quick Nav"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="18" y2="18" />
        </svg>
      </button>

      {/* Weather briefing — one for the whole chain */}
      {dailyForecasts.length > 0 && (
        <div className="mb-3">
          <WeatherBriefing forecasts={dailyForecasts} />
        </div>
      )}

      {/* ═══ SCROLL TEASER — shows what's below ═══ */}
      {scrollSections.length > 0 && (
        <div className="rounded-lg bg-sky-100/70 border border-sky-200/60 px-3 py-2.5 mb-2">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500 shrink-0">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
            <p className="text-[12px] text-sky-800">
              {scrollSections.map((s, i) => (
                <span key={s.id}>
                  {i > 0 && ' · '}
                  <button
                    onClick={() => {
                      document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="underline font-semibold active:text-sky-600"
                  >
                    {s.label}
                  </button>
                  <span className="text-sky-600"> ({s.count})</span>
                </span>
              ))}
            </p>
          </div>
        </div>
      )}

      {/* ═══ CURRENT TIP ═══ */}
      <div className="rounded-lg bg-amber-50/70 border border-amber-200/60 px-3 py-2.5 mb-1">
        <p className="text-[11.5px] text-amber-800 leading-relaxed">
          <span className="font-semibold">Heads up:</span> In tight cuts, the current can reverse
          30–60 min <span className="font-medium">before</span> the predicted high or low tide.
          Plan early and watch the water, not just the clock.
        </p>
      </div>

      {/* ═══ ACTIVITIES PROMO ═══ */}
      {onActivities && (
        <button
          onClick={onActivities}
          className="w-full rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/60 px-4 py-3 mb-1 flex items-center gap-3 active:scale-[0.995] transition-transform text-left"
        >
          <span className="text-2xl">🌊</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800">Tide-Dependent Activities</p>
            <p className="text-xs text-slate-500 mt-0.5">Lazy River, Washing Machine, Bubble Bath — see what's ideal right now</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400 flex-shrink-0">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* ═══ EXUMA CUTS ═══ */}
      {exumaCuts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 px-1 pt-2 pb-2">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Exuma Cuts
            </h2>
            <div className="flex-1 h-px bg-slate-300" />
            <StatusSummary cuts={exumaCuts} />
          </div>
          <div className="space-y-3">
            {exumaCuts.map((s) => (
              <div id={`cut-${s.cut.id}`} key={s.cut.id}>
                <CutCard
                  status={s}
                  marineData={marineData}
                  onSelect={() => onSelect(s.cut.id)}
                  onReport={() => onSelect(s.cut.id, true)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ SOUTHERN EXUMAS ═══ */}
      {southernCuts.length > 0 && (
        <div id="southern-section">
          <div className="flex items-center gap-2 px-1 pt-4 pb-2">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Southern Exumas
            </h2>
            <div className="flex-1 h-px bg-slate-300" />
            <StatusSummary cuts={southernCuts} />
          </div>
          <p className="text-xs text-slate-500 px-1 -mt-1 mb-2.5">
            Lee Stocking Island to George Town
          </p>
          <div className="space-y-3">
            {southernCuts.map((s) => (
              <div id={`cut-${s.cut.id}`} key={s.cut.id}>
                <CutCard
                  status={s}
                  marineData={marineData}
                  onSelect={() => onSelect(s.cut.id)}
                  onReport={() => onSelect(s.cut.id, true)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ RAGGEDS CUTS ═══ */}
      {raggedsCuts.length > 0 && (
        <div id="raggeds-section">
          <div className="flex items-center gap-2 px-1 pt-4 pb-2">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Off to The Raggeds
            </h2>
            <div className="flex-1 h-px bg-slate-300" />
            <StatusSummary cuts={raggedsCuts} />
          </div>
          <p className="text-xs text-slate-500 px-1 -mt-1 mb-2.5">
            Depth-critical — transit at or near high tide
          </p>
          <div className="space-y-3">
            {raggedsCuts.map((s) => (
              <div id={`cut-${s.cut.id}`} key={s.cut.id}>
                <CutCard
                  status={s}
                  marineData={marineData}
                  onSelect={() => onSelect(s.cut.id)}
                  onReport={() => onSelect(s.cut.id, true)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ═══ DISCLAIMER ═══ */}
      <div className="mt-6 rounded-xl border border-amber-200/60 bg-amber-50/60 px-4 py-3 space-y-2">
        <p className="text-[11px] text-amber-700 leading-relaxed">
          <span className="font-semibold">Disclaimer:</span> All depths, currents, and transit suggestions are estimates based on
          NOAA predictions and calculated offsets. Not a substitute for local knowledge or
          visual assessment. Always verify conditions before transiting any cut.
        </p>
      </div>
    </div>
  )
}

function StatusSummary({ cuts }: { cuts: CutStatus[] }) {
  const hazCount = cuts.filter((s) => s.safetyLevel === 'hazardous').length
  const cautCount = cuts.filter((s) => s.safetyLevel === 'caution').length
  const safeCount = cuts.filter((s) => s.safetyLevel === 'safe').length

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold">
      {safeCount > 0 && (
        <span className="flex items-center gap-0.5 text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          {safeCount}
        </span>
      )}
      {cautCount > 0 && (
        <span className="flex items-center gap-0.5 text-amber-700">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          {cautCount}
        </span>
      )}
      {hazCount > 0 && (
        <span className="flex items-center gap-0.5 text-red-700">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          {hazCount}
        </span>
      )}
    </div>
  )
}
