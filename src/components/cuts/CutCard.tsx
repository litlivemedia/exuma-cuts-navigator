import { format } from 'date-fns'
import type { CutStatus } from '../../types/cut.ts'
import type { MarineHourly } from '../../types/marine.ts'
import { getMarineAtTime } from '../../services/marine.ts'
import { degreesToCardinal } from '../../services/wind.ts'

export function CutCard({
  status,
  marineData,
  onSelect,
  onReport,
}: {
  status: CutStatus
  marineData: MarineHourly[]
  onSelect: () => void
  onReport: () => void
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

  // Wave data (area-wide, closest hour)
  const wave = getMarineAtTime(marineData, new Date())

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect() }}
      className={`w-full text-left rounded-2xl bg-white shadow-sm active:scale-[0.995] transition-all overflow-hidden cursor-pointer ${
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

        {/* ── Row 3b: Waves ── */}
        {wave && wave.waveHeightFt > 0 && (
          <div className="mt-1.5 text-[13px] text-slate-400">
            Waves {wave.waveHeightFt.toFixed(1)}ft {degreesToCardinal(wave.waveDirectionDeg)} · {wave.wavePeriodSec.toFixed(0)}s period
          </div>
        )}

        {/* ── CutNav Slack ── */}
        {status.estimatedSlackTime && status.minutesToEstSlack != null && (
          <div className="mt-3 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">CutNav Slack</span>
              <span className="font-medium text-indigo-600">
                {format(status.estimatedSlackTime, 'h:mm a')}
              </span>
              {status.minutesToEstSlack > 0 && (
                <span className="text-slate-300">{fmtDur(status.minutesToEstSlack)}</span>
              )}
              {status.minutesToEstSlack <= 0 && status.minutesToEstSlack > -30 && (
                <span className="text-emerald-500 font-medium">now</span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 italic">
              based on an absurdly complex and perhaps completely wrong algorithm
            </p>
          </div>
        )}

        {/* ── Suggested transit time ── */}
        {status.bestDaylightWindow && (
          <p className={`mt-3 text-[13px] font-medium ${safetyCfg.text}`}>
            Suggested {status.bestDaylightWindow.label}
          </p>
        )}

      </div>

      {/* ── CTA footer ── */}
      <div className="bg-sky-50 border-t border-sky-100 px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-sky-700">
            View Details
          </span>
          <span className="text-slate-300">·</span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onReport() }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onReport() } }}
            className="flex items-center gap-1 text-[12px] text-indigo-500 hover:text-indigo-700 active:text-indigo-800 cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Report Transit
          </span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </div>
  )
}

function fmtDur(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
