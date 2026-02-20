import { useMemo } from 'react'
import { format } from 'date-fns'
import type { HiLo } from '../../types/tide.ts'
import type { WindHourly } from '../../types/wind.ts'
import type { CutDefinition } from '../../types/cut.ts'
import { scoreTransitWindows, type TransitDay, type TransitWindow } from '../../services/transitScorer.ts'

/** Convert numeric score to a captain-friendly word */
function scoreLabel(score: number): string {
  if (score >= 9) return 'IDEAL'
  if (score >= 7) return 'GOOD'
  if (score >= 5) return 'FAIR'
  if (score >= 3) return 'RISKY'
  return 'POOR'
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

  // Find overall best across all days
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
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
          {cut.depthCritical ? '3-Day Depth & Transit Planner' : '3-Day Transit Planner'}
        </h3>
      </div>

      {/* Legend — explains what scores mean */}
      <div className="flex items-center gap-3 mb-3 text-[10px]">
        <span className="text-slate-400">Transit safety:</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-slate-500">Ideal/Good</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-slate-500">Fair</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-slate-500">Risky/Poor</span>
        </span>
      </div>

      {!hasAnyWindows ? (
        <p className="text-sm text-slate-400">No transit windows available in forecast range.</p>
      ) : (
        <div className="space-y-6">
          {days.map((day, i) => (
            <DaySection
              key={day.label}
              day={day}
              overallBest={overallBest}
              isDepthCritical={!!cut.depthCritical}
              isFirst={i === 0}
            />
          ))}
        </div>
      )}

      <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
        Scores factor in slack timing, wind speed/direction
        {cut.depthCritical ? ', water depth,' : ','} and daylight.
        Confidence decreases beyond 48 hours. Always assess conditions visually before transiting.
      </p>
    </div>
  )
}

function DaySection({
  day,
  overallBest,
  isDepthCritical,
  isFirst,
}: {
  day: TransitDay
  overallBest: TransitWindow | null
  isDepthCritical: boolean
  isFirst: boolean
}) {
  if (day.windows.length === 0) {
    return (
      <div>
        {!isFirst && <div className="border-t border-slate-100 mb-3" />}
        <div className="text-[13px] font-bold text-slate-700 tracking-wide mb-1.5">
          {day.label}
          {day.label !== 'Today' && (
            <span className="font-normal text-slate-400 ml-1.5 text-xs">
              {format(day.date, 'MMM d')}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 italic">No slack windows in daylight</p>
      </div>
    )
  }

  return (
    <div>
      {!isFirst && <div className="border-t border-slate-100 mb-3" />}
      <div className="text-[13px] font-bold text-slate-700 tracking-wide mb-2.5">
        {day.label}
        {day.label !== 'Today' && (
          <span className="font-normal text-slate-400 ml-1.5 text-xs">
            {format(day.date, 'MMM d')}
          </span>
        )}
      </div>
      <div className="space-y-2.5">
        {day.windows.map((w, i) => (
          <WindowRow
            key={i}
            window={w}
            isBest={overallBest === w}
            isDepthCritical={isDepthCritical}
          />
        ))}
      </div>
    </div>
  )
}

function WindowRow({
  window: w,
  isBest,
  isDepthCritical,
}: {
  window: TransitWindow
  isBest: boolean
  isDepthCritical: boolean
}) {
  const isGood = w.score >= 7
  const isMid = w.score >= 5 && w.score < 7
  const isPoor = w.score < 5

  const label = scoreLabel(w.score)

  const scoreColor = isGood
    ? 'text-green-600'
    : isMid
      ? 'text-amber-600'
      : 'text-red-500'

  const labelBg = isGood
    ? 'bg-green-100 text-green-700'
    : isMid
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-600'

  const barColor = isGood
    ? 'bg-green-500'
    : isMid
      ? 'bg-amber-500'
      : 'bg-red-400'

  const bgClass = isBest
    ? 'bg-green-50 border-2 border-green-400 shadow-sm'
    : isGood
      ? 'bg-green-50/60 border border-green-300'
      : isPoor
        ? 'bg-red-50/40 border border-red-200'
        : !w.factors.daylight
          ? 'bg-slate-50 border border-slate-150'
          : 'bg-white border border-slate-100'

  const confidenceIcon =
    w.confidence === 'high'
      ? null
      : w.confidence === 'good'
        ? '~'
        : '?'

  return (
    <div className={`rounded-lg px-3 py-2.5 mx-2 ${bgClass}`}>
      {/* Score + time row: score anchored left, time + best right */}
      <div className="flex items-center gap-3">
        {/* Score — big number + word label, left-anchored */}
        <div className="w-14 shrink-0 text-center">
          <div className={`font-black ${isGood ? 'text-2xl' : 'text-xl'} ${scoreColor} leading-none`}>
            {w.score}
          </div>
          <div className={`text-[9px] font-bold mt-0.5 rounded-sm px-1 py-px ${labelBg}`}>
            {label}
          </div>
        </div>

        {/* Center: time + type stacked */}
        <div className="flex-1 min-w-0">
          <div className={`text-base font-bold ${isGood ? 'text-green-800' : isPoor ? 'text-slate-500' : 'text-slate-800'} leading-tight`}>
            {format(w.time, 'h:mm a')}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              w.type === 'H'
                ? 'bg-sky-100 text-sky-700'
                : 'bg-slate-100 text-slate-600'
            }`}>
              {w.type === 'H' ? 'HIGH' : 'LOW'}
            </span>

            {isDepthCritical && w.depthFt != null && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                w.depthFt >= 6
                  ? 'bg-green-100 text-green-700'
                  : w.depthFt >= 5
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
              }`}>
                {w.depthFt.toFixed(1)}ft
              </span>
            )}
          </div>
        </div>

        {/* Suggested badge */}
        {isBest && (
          <div className="shrink-0 flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            SUGGESTED
          </div>
        )}
      </div>

      {/* Score bar — narrower, inset */}
      <div className="mt-2 mx-0.5">
        <div className={`rounded-full overflow-hidden ${isGood ? 'h-2' : 'h-1.5'} ${isPoor ? 'bg-red-50' : 'bg-slate-100'}`} style={{ width: '70%' }}>
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${w.score * 10}%` }}
          />
        </div>
      </div>

      {/* Wind + conditions row */}
      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
        <span className={`text-[11px] px-1.5 py-0.5 rounded ${
          w.factors.windOpposing
            ? 'bg-red-100 text-red-700 font-semibold'
            : w.windSpeedKnots >= 15
              ? 'bg-amber-50 text-amber-700'
              : 'text-slate-500'
        }`}>
          {w.factors.windOpposing && '⚠ '}
          {w.windCardinal} {Math.round(w.windSpeedKnots)}
          {w.windGustKnots > w.windSpeedKnots + 5
            ? `g${Math.round(w.windGustKnots)}`
            : ''
          }kts
        </span>

        {!w.factors.daylight && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
            🌙 dark
          </span>
        )}

        {confidenceIcon && (
          <span className="text-[10px] text-slate-400" title={`Forecast confidence: ${w.confidence}`}>
            {w.confidence === 'good' ? '±' : '~'} forecast
          </span>
        )}
      </div>
    </div>
  )
}
