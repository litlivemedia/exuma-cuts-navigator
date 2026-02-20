import { format } from 'date-fns'
import type { CutStatus } from '../../types/cut.ts'
import { WindIndicator } from '../wind/WindIndicator.tsx'

export function CutCard({
  status,
  onSelect,
}: {
  status: CutStatus
  onSelect: () => void
}) {
  if (status.cut.depthCritical) {
    return <DepthCriticalCard status={status} onSelect={onSelect} />
  }
  return <StandardCard status={status} onSelect={onSelect} />
}

// ─── Safety pill (inline) ──────────────────────────────────────

function SafetyPill({ level }: { level: CutStatus['safetyLevel'] }) {
  const cfg = {
    safe:      { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Safe' },
    caution:   { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Caution' },
    hazardous: { bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500',     label: 'Hazardous' },
  }[level]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ─── Depth-critical card (Raggeds / Southern) ──────────────────

function DepthCriticalCard({
  status,
  onSelect,
}: {
  status: CutStatus
  onSelect: () => void
}) {
  const depthNow = status.depthNowFt
  const nextHigh = status.nextHighTide
  const isTideRising = status.tideDirection === 'flooding'

  const depthColor =
    depthNow != null && depthNow < 5
      ? 'text-red-600'
      : depthNow != null && depthNow < 6
        ? 'text-amber-600'
        : 'text-emerald-600'

  const depthBg =
    depthNow != null && depthNow < 5
      ? 'bg-red-50/80 border-red-200/60'
      : depthNow != null && depthNow < 6
        ? 'bg-amber-50/80 border-amber-200/60'
        : 'bg-emerald-50/80 border-emerald-200/60'

  return (
    <button
      onClick={onSelect}
      className="w-full text-left rounded-2xl bg-white border border-slate-200/80 shadow-sm active:scale-[0.995] transition-all"
    >
      {/* Header row */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">
          {status.cut.name}
        </h3>
        <SafetyPill level={status.safetyLevel} />
      </div>

      {/* Depth block */}
      <div className={`mx-3 rounded-xl border p-3.5 ${depthBg}`}>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Depth now
            </div>
            <div className={`text-3xl font-extrabold tracking-tight leading-none mt-0.5 ${depthColor}`}>
              {depthNow != null ? depthNow.toFixed(1) : '—'}
              <span className="text-lg font-bold ml-0.5">ft</span>
            </div>
          </div>
          <div className="text-right pb-0.5">
            <div className={`text-sm font-semibold ${isTideRising ? 'text-emerald-600' : status.tideDirection === 'slack' ? 'text-slate-500' : 'text-amber-600'}`}>
              {isTideRising ? '↑ Rising' : status.tideDirection === 'slack' ? '— Slack' : '↓ Falling'}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {status.heightFt >= 0 ? '+' : ''}{status.heightFt.toFixed(1)} ft tide
            </div>
          </div>
        </div>

        {/* Depth bar */}
        {depthNow != null && (
          <div className="mt-3">
            <div className="h-2 bg-white/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  depthNow < 5 ? 'bg-red-400' : depthNow < 6 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, (depthNow / 10) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0</span>
              <span>{status.cut.mlwDepthFt}ft MLW</span>
              <span>{nextHigh ? `${nextHigh.depthFt.toFixed(1)}ft HT` : ''}</span>
            </div>
          </div>
        )}
      </div>

      {/* Next high tide */}
      {nextHigh && (
        <div className="mx-3 mt-2.5 rounded-xl border border-sky-200/60 bg-sky-50/60 px-3.5 py-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-sky-800">
              {nextHigh.depthFt.toFixed(1)}ft
            </span>
            <span className="text-sm text-sky-600">
              at high tide
            </span>
            <span className="text-xs text-slate-400 ml-auto">
              {format(nextHigh.time, 'h:mm a')}
              {nextHigh.minutesAway > 0 && ` · ${formatDuration(nextHigh.minutesAway)}`}
            </span>
          </div>
        </div>
      )}

      {/* Wind row */}
      <div className="px-4 pt-3">
        <WindIndicator
          speedKnots={status.windSpeedKnots}
          gustKnots={status.windGustKnots}
          directionDeg={status.windDirectionDeg}
          cardinal={status.windDirectionCardinal}
          isOpposing={status.isWindAgainstCurrent}
        />
      </div>

      {/* Tap footer */}
      <div className="mx-4 mt-3 mb-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-sky-600">
          Transit planner & details
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-300">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </button>
  )
}

// ─── Standard card (Exuma cuts) ─────────────────────────────────

function StandardCard({
  status,
  onSelect,
}: {
  status: CutStatus
  onSelect: () => void
}) {
  const dirLabel =
    status.tideDirection === 'slack'
      ? 'Slack'
      : status.tideDirection === 'flooding'
        ? 'Flooding'
        : 'Ebbing'

  const dirColor =
    status.tideDirection === 'slack'
      ? 'text-emerald-600'
      : 'text-sky-600'

  const nextLabel = status.nextEventType === 'H' ? 'High' : 'Low'

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl shadow-sm border active:scale-[0.995] transition-all ${
        status.isWindAgainstCurrent && status.safetyLevel === 'hazardous'
          ? 'bg-red-50/60 border-red-200'
          : 'bg-white border-slate-200/80'
      }`}
    >
      {/* Wind opposing current warning banner */}
      {status.isWindAgainstCurrent && (
        <div className={`px-4 py-2.5 rounded-t-2xl flex items-center gap-2 ${
          status.safetyLevel === 'hazardous'
            ? 'bg-red-600 text-white'
            : 'bg-amber-500 text-white'
        }`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-[13px] font-bold">
            {status.safetyLevel === 'hazardous'
              ? 'DANGEROUS — Wind Against Current'
              : 'CAUTION — Wind Against Current'}
          </span>
        </div>
      )}

      {/* ── Card body ── */}
      <div className="px-4 pt-4 pb-1">
        {/* Row 1: Name + Safety */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">
            {status.cut.name}
          </h3>
          <SafetyPill level={status.safetyLevel} />
        </div>

        {/* Row 2: Current status + depth */}
        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`text-[15px] font-semibold ${dirColor}`}>
              {dirLabel}
            </span>
            {status.tideDirection !== 'slack' && (
              <span className="text-sm text-slate-400">
                {status.currentSpeedKnots.toFixed(1)} kts
              </span>
            )}
          </div>
          {status.depthNowFt != null && (
            <span className={`text-sm font-semibold ${
              status.depthNowFt < 6 ? 'text-red-600' : status.depthNowFt < 8 ? 'text-amber-600' : 'text-slate-500'
            }`}>
              {status.depthNowFt.toFixed(1)}ft
            </span>
          )}
        </div>

        {/* Row 3: Next tide event */}
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm text-slate-500">
            {nextLabel} {status.nextEventHeight.toFixed(1)}ft
          </span>
          <span className="text-sm text-slate-400">
            at {format(status.nextEventTime, 'h:mm a')}
          </span>
          <span className="text-xs text-slate-300 ml-auto">
            {status.minutesToNextEvent > 0
              ? formatDuration(status.minutesToNextEvent)
              : 'now'}
          </span>
        </div>

        {/* Row 4: Wind */}
        <div className="mt-3">
          <WindIndicator
            speedKnots={status.windSpeedKnots}
            gustKnots={status.windGustKnots}
            directionDeg={status.windDirectionDeg}
            cardinal={status.windDirectionCardinal}
            isOpposing={status.isWindAgainstCurrent}
          />
        </div>
      </div>

      {/* Suggested transit / slack banners */}
      <div className="px-4 pb-1">
        {status.bestDaylightWindow && (
          <div className="mt-2.5 flex items-center gap-2 text-[13px] text-sky-700 bg-sky-50/80 border border-sky-200/50 rounded-xl px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-sky-400">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <span>
              <span className="font-semibold">Suggested transit</span>{' '}
              <span className="text-sky-500">{status.bestDaylightWindow.label}</span>
            </span>
          </div>
        )}

        {status.minutesToSlack !== null && status.minutesToSlack > 0 && !status.bestDaylightWindow && (
          <div className="mt-2.5 text-[13px] text-emerald-700 bg-emerald-50/80 border border-emerald-200/50 rounded-xl px-3 py-2">
            Next slack in <span className="font-semibold">{formatDuration(status.minutesToSlack)}</span>
          </div>
        )}
        {status.minutesToSlack === 0 && (
          <div className="mt-2.5 text-[13px] text-emerald-800 bg-emerald-100/80 border border-emerald-200/50 rounded-xl px-3 py-2 font-semibold">
            ● Slack water NOW — safe transit window
          </div>
        )}
      </div>

      {/* Tap footer */}
      <div className="mx-4 mt-3 mb-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-sky-600">
          Transit planner & details
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-300">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </button>
  )
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
