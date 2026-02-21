import { format } from 'date-fns'
import type { CutStatus } from '../../types/cut.ts'

export function CutCard({
  status,
  onSelect,
}: {
  status: CutStatus
  onSelect: () => void
}) {
  const depth = status.depthNowFt
  const isOpposing = status.isWindAgainstCurrent
  const isHazardous = status.safetyLevel === 'hazardous'
  const isCaution = status.safetyLevel === 'caution'

  // Direction label + color
  const dirLabel =
    status.tideDirection === 'slack'
      ? 'Slack'
      : status.tideDirection === 'flooding'
        ? '↑ Flooding'
        : '↓ Ebbing'

  const dirColor =
    status.tideDirection === 'slack'
      ? 'text-emerald-600'
      : 'text-slate-500'

  // Depth color — only tint when shallow
  const depthColor =
    depth != null && depth < 5
      ? 'text-red-600'
      : depth != null && depth < 6
        ? 'text-amber-600'
        : 'text-slate-900'

  // Safety dot
  const safetyCfg = {
    safe:      { dot: 'bg-emerald-500', label: 'Safe',      text: 'text-emerald-600' },
    caution:   { dot: 'bg-amber-500',   label: 'Caution',   text: 'text-amber-600' },
    hazardous: { dot: 'bg-red-500',     label: 'Hazardous', text: 'text-red-600' },
  }[status.safetyLevel]

  // Next tide
  const nextLabel = status.nextEventType === 'H' ? 'High' : 'Low'

  // Wind text
  const windText = `${status.windDirectionCardinal} ${Math.round(status.windSpeedKnots)}kts`
  const gustText =
    status.windGustKnots > status.windSpeedKnots + 5
      ? ` g${Math.round(status.windGustKnots)}`
      : ''

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl bg-white shadow-sm active:scale-[0.995] transition-all overflow-hidden ${
        isOpposing && isHazardous
          ? 'border-t-[3px] border-t-red-500 border border-red-200/80'
          : isOpposing && isCaution
            ? 'border-t-[3px] border-t-amber-500 border border-amber-200/80'
            : 'border border-slate-200/80'
      }`}
    >
      <div className="px-5 pt-5 pb-4">

        {/* ── Row 1: Name + Safety ── */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">
            {status.cut.name}
          </h3>
          <span className={`flex items-center gap-1.5 text-xs font-medium ${safetyCfg.text}`}>
            <span className={`w-2 h-2 rounded-full ${safetyCfg.dot}`} />
            {safetyCfg.label}
          </span>
        </div>

        {/* ── Row 2: Depth + Direction ── */}
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            {depth != null ? (
              <>
                <span className={`text-[28px] font-light tracking-tight leading-none ${depthColor}`}>
                  {depth.toFixed(1)}
                </span>
                <span className={`text-sm font-medium ${depthColor === 'text-slate-900' ? 'text-slate-400' : depthColor}`}>
                  ft
                </span>
              </>
            ) : (
              <span className="text-[28px] font-light tracking-tight leading-none text-slate-300">
                —
              </span>
            )}
          </div>
          <div className="text-right">
            <span className={`text-[15px] font-medium ${dirColor}`}>
              {dirLabel}
            </span>
            {status.tideDirection !== 'slack' && (
              <span className="text-sm text-slate-400 ml-1.5">
                {status.currentSpeedKnots.toFixed(1)} kts
              </span>
            )}
          </div>
        </div>

        {/* ── Depth bar (depth-critical cuts only) ── */}
        {status.cut.depthCritical && depth != null && (
          <div className="mt-2.5">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  depth < 5 ? 'bg-red-400' : depth < 6 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, (depth / 10) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Row 3: Wind + Next tide ── */}
        <div className="mt-4 flex items-center justify-between text-[13px]">
          <span className={isOpposing ? 'font-medium text-red-600' : 'text-slate-400'}>
            {windText}{gustText}
            {isOpposing && <span className="ml-1 text-red-500">opposing</span>}
          </span>
          <span className="text-slate-400">
            {nextLabel} {format(status.nextEventTime, 'h:mm a')}
            {status.minutesToNextEvent > 0 && (
              <span className="text-slate-300 ml-1.5">{fmtDur(status.minutesToNextEvent)}</span>
            )}
          </span>
        </div>

        {/* ── Row 4: Suggested transit + chevron ── */}
        {status.bestDaylightWindow && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[13px] text-sky-600">
              Suggested {status.bestDaylightWindow.label}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        )}

        {/* ── Chevron-only footer when no transit window ── */}
        {!status.bestDaylightWindow && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        )}

      </div>
    </button>
  )
}

function fmtDur(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
