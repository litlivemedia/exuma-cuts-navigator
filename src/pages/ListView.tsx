import type { CutStatus } from '../types/cut.ts'
import type { MarineDaily } from '../types/marine.ts'
import { CutCard } from '../components/cuts/CutCard.tsx'
import { WeatherBriefing } from '../components/weather/WeatherBriefing.tsx'

export function ListView({
  statuses,
  onSelect,
  dailyForecasts,
}: {
  statuses: CutStatus[]
  onSelect: (id: string) => void
  dailyForecasts: MarineDaily[]
}) {
  const exumaCuts = statuses.filter((s) => s.cut.group === 'exuma')
  const raggedsCuts = statuses.filter((s) => s.cut.group === 'raggeds')

  return (
    <div className="pl-4 pr-6 py-4 pb-24 space-y-2">
      {/* Weather briefing — one for the whole chain */}
      {dailyForecasts.length > 0 && (
        <div className="mb-3">
          <WeatherBriefing forecasts={dailyForecasts} />
        </div>
      )}

      {/* ═══ RAGGEDS TEASER — at top so users know to scroll ═══ */}
      {raggedsCuts.length > 0 && (
        <div className="rounded-lg bg-sky-100/70 border border-sky-200/60 px-3 py-2.5 mb-2">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500 shrink-0">
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
            <p className="text-[12px] text-sky-800">
              <span className="font-semibold">The Raggeds</span> — {raggedsCuts.length} cuts below · scroll down or{' '}
              <button
                onClick={() => {
                  document.getElementById('raggeds-section')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="underline font-semibold active:text-sky-600"
              >
                jump there
              </button>
            </p>
          </div>
        </div>
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
              <CutCard
                key={s.cut.id}
                status={s}
                onSelect={() => onSelect(s.cut.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══ RAGGEDS CUTS ═══ */}
      {raggedsCuts.length > 0 && (
        <div id="raggeds-section">
          <div className="flex items-center gap-2 px-1 pt-1 pb-2">
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
              <CutCard
                key={s.cut.id}
                status={s}
                onSelect={() => onSelect(s.cut.id)}
              />
            ))}
          </div>
        </div>
      )}
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
