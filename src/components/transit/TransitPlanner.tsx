import { useMemo } from 'react'
import { format } from 'date-fns'
import type { HiLo } from '../../types/tide.ts'
import type { WindHourly } from '../../types/wind.ts'
import type { CutDefinition } from '../../types/cut.ts'
import { scoreTransitWindows, type TransitDay, type TransitWindow } from '../../services/transitScorer.ts'

function scoreLabel(score: number): string {
  if (score >= 9) return 'Ideal'
  if (score >= 7) return 'Good'
  if (score >= 5) return 'Fair'
  if (score >= 3) return 'Risky'
  return 'Poor'
}

export function TransitPlanner({
  cut,
  nassauTides,
  windData,
  now,
}: {
  cut: CutDefinition
  nassauTides: HiLo[]
  windData: WindHourly[]
  now: Date
}) {
  const days = useMemo(
    () => scoreTransitWindows(cut, nassauTides, windData, now),
    [cut, nassauTides, windData, now]
  )

  const overallBest = useMemo(() => {
    let best: TransitWindow | null = null
    for (const day of days) {
      if (day.bestWindow && (!best || day.bestWindow.score > best.score)) {
        best = day.bestWindow
      }
    }
    return best
  }, [days])

  const hasAnyWindows = days.some((d) => d.windows.length > 0)

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
          Transit Planner
        </h3>

        {!hasAnyWindows ? (
          <p className="text-sm text-slate-400 mt-3">No transit windows in forecast range.</p>
        ) : (
          <div className="mt-4 space-y-5">
            {days.map((day, i) => (
              <DaySection key={day.label} day={day} overallBest={overallBest} isFirst={i === 0} />
            ))}
          </div>
        )}

        <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
          Factors: slack timing, wind, depth, and daylight.
          Always assess conditions visually before transiting.
        </p>
      </div>
    </div>
  )
}

function DaySection({
  day,
  overallBest,
  isFirst,
}: {
  day: TransitDay
  overallBest: TransitWindow | null
  isFirst: boolean
}) {
  if (day.windows.length === 0) {
    return (
      <div>
        {!isFirst && <div className="border-t border-slate-100 mb-3" />}
        <div className="text-[13px] font-semibold text-slate-700 mb-1">
          {day.label}
          {day.label !== 'Today' && (
            <span className="font-normal text-slate-400 ml-1.5 text-xs">
              {format(day.date, 'MMM d')}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">No slack windows in daylight</p>
      </div>
    )
  }

  return (
    <div>
      {!isFirst && <div className="border-t border-slate-100 mb-3" />}
      <div className="text-[13px] font-semibold text-slate-700 mb-2.5">
        {day.label}
        {day.label !== 'Today' && (
          <span className="font-normal text-slate-400 ml-1.5 text-xs">
            {format(day.date, 'MMM d')}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {day.windows.map((w, i) => (
          <WindowRow key={i} window={w} isBest={overallBest === w} />
        ))}
      </div>
    </div>
  )
}

function WindowRow({
  window: w,
  isBest,
}: {
  window: TransitWindow
  isBest: boolean
}) {
  const label = scoreLabel(w.score)
  const isGood = w.score >= 7
  const isMid = w.score >= 5 && w.score < 7

  const scoreCfg = isGood
    ? { dot: 'bg-emerald-500', text: 'text-emerald-600' }
    : isMid
      ? { dot: 'bg-amber-500', text: 'text-amber-600' }
      : { dot: 'bg-red-500', text: 'text-red-600' }

  // Build compact detail line
  const details: string[] = []
  details.push(w.type === 'H' ? 'High slack' : 'Low slack')
  if (w.depthFt != null) details.push(`${w.depthFt.toFixed(1)} ft`)
  const gustSuffix =
    w.windGustKnots > w.windSpeedKnots + 5 ? `g${Math.round(w.windGustKnots)}` : ''
  details.push(`${w.windCardinal} ${Math.round(w.windSpeedKnots)}${gustSuffix}kts`)

  return (
    <div
      className={`rounded-xl px-4 py-3 ${
        isBest
          ? 'bg-emerald-50/50 border border-emerald-200/60'
          : 'bg-slate-50/50 border border-slate-100'
      }`}
    >
      {/* Row 1: Time + score dot/word */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-slate-900">
            {format(w.time, 'h:mm a')}
          </span>
          {isBest && (
            <span className="text-[11px] font-medium text-emerald-600">Suggested</span>
          )}
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-medium ${scoreCfg.text}`}>
          <span className={`w-2 h-2 rounded-full ${scoreCfg.dot}`} />
          {label}
        </span>
      </div>

      {/* Row 2: Compact details */}
      <div className="mt-1 text-[13px] text-slate-400">
        {details.join(' · ')}
        {w.factors.windOpposing && <span className="text-red-500 ml-1">opposing</span>}
        {!w.factors.daylight && <span className="text-slate-300 ml-1.5">dark</span>}
        {w.confidence !== 'high' && (
          <span className="text-slate-300 ml-1.5">
            {w.confidence === 'good' ? '~' : '?'}
          </span>
        )}
      </div>
    </div>
  )
}
