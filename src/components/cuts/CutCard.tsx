import { format } from 'date-fns'
import type { CutStatus } from '../../types/cut.ts'
import { SafetyBadge } from '../safety/SafetyBadge.tsx'
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

// ─── Depth-critical card (Raggeds) ──────────────────────────────

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

  // Depth color: red < 5ft, amber 5-6ft, green > 6ft
  const depthColor =
    depthNow != null && depthNow < 5
      ? 'text-red-700'
      : depthNow != null && depthNow < 6
        ? 'text-amber-700'
        : 'text-green-700'

  const depthBg =
    depthNow != null && depthNow < 5
      ? 'bg-red-50 border-red-200'
      : depthNow != null && depthNow < 6
        ? 'bg-amber-50 border-amber-200'
        : 'bg-green-50 border-green-200'

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl shadow-sm border p-4 active:bg-slate-50 transition-colors bg-white border-slate-200`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900 text-base">
          {status.cut.name}
        </h3>
        <SafetyBadge level={status.safetyLevel} compact />
      </div>

      {/* Big depth display */}
      <div className={`mt-3 rounded-lg border p-3 ${depthBg}`}>
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Depth Now
            </div>
            <div className={`text-2xl font-bold ${depthColor}`}>
              {depthNow != null ? `${depthNow.toFixed(1)} ft` : '—'}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${isTideRising ? 'text-green-700' : 'text-amber-700'}`}>
              {isTideRising ? 'Rising' : status.tideDirection === 'slack' ? 'Slack' : 'Falling'}
              {status.tideDirection !== 'slack' && (
                <span className="text-slate-400 font-normal">
                  {' '}{isTideRising ? '\u2191' : '\u2193'}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500">
              Tide: {status.heightFt >= 0 ? '+' : ''}{status.heightFt.toFixed(1)} ft
            </div>
          </div>
        </div>

        {/* Depth bar visual */}
        {depthNow != null && (
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
              <span>0 ft</span>
              <span>{status.cut.mlwDepthFt} ft MLW</span>
              <span>{nextHigh ? `${nextHigh.depthFt.toFixed(1)} ft HT` : ''}</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  depthNow < 5 ? 'bg-red-500' : depthNow < 6 ? 'bg-amber-500' : 'bg-sky-500'
                }`}
                style={{ width: `${Math.min(100, (depthNow / 10) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Next high tide — the money info */}
      {nextHigh && (
        <div className="mt-2.5 rounded-lg border border-sky-200 bg-sky-50 p-2.5">
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-600 shrink-0">
              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
            </svg>
            <div className="text-sm">
              <span className="font-bold text-sky-800">
                High tide: {nextHigh.depthFt.toFixed(1)} ft depth
              </span>
              <span className="text-sky-600">
                {' '}at {format(nextHigh.time, 'h:mm a')}
              </span>
              <span className="text-slate-400">
                {' '}({nextHigh.minutesAway > 0 ? `in ${formatDuration(nextHigh.minutesAway)}` : 'now'})
              </span>
            </div>
          </div>
          <div className="mt-1 text-xs text-sky-700">
            Tide height: +{nextHigh.heightFt.toFixed(1)} ft above MLW
            {nextHigh.heightFt >= 2.8 && ' — strong high'}
            {nextHigh.heightFt >= 2.5 && nextHigh.heightFt < 2.8 && ' — average high'}
            {nextHigh.heightFt < 2.5 && ' — weak high, less depth'}
          </div>
        </div>
      )}

      {/* Upcoming highs for planning */}
      {status.cut.mlwDepthFt != null && (
        <div className="mt-2 text-xs text-slate-500 px-0.5">
          MLW depth: {status.cut.mlwDepthFt} ft &middot; Transit at or near high tide
        </div>
      )}

      {/* Wind (smaller, less prominent than for Exuma cuts) */}
      <div className="mt-2">
        <WindIndicator
          speedKnots={status.windSpeedKnots}
          gustKnots={status.windGustKnots}
          directionDeg={status.windDirectionDeg}
          cardinal={status.windDirectionCardinal}
          isOpposing={status.isWindAgainstCurrent}
        />
      </div>

      {/* Tap affordance */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 -mb-1">
        <span className="text-[11px] font-medium text-sky-600">
          Transit planner & details
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
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

  const nextLabel = status.nextEventType === 'H' ? 'High' : 'Low'

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl shadow-sm border p-4 active:bg-slate-50 transition-colors ${
        status.isWindAgainstCurrent && status.safetyLevel === 'hazardous'
          ? 'bg-red-50 border-red-300'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* Wind opposing current warning banner */}
      {status.isWindAgainstCurrent && (
        <div className={`-mx-4 -mt-4 mb-3 px-4 py-2.5 rounded-t-xl flex items-center gap-2 ${
          status.safetyLevel === 'hazardous'
            ? 'bg-red-600 text-white'
            : 'bg-amber-500 text-white'
        }`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="text-sm font-bold">
            {status.safetyLevel === 'hazardous'
              ? 'DANGEROUS — Wind Against Current'
              : 'CAUTION — Wind Against Current'}
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-base">
            {status.cut.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-3 text-sm">
            <span className={`font-medium ${
              status.tideDirection === 'slack'
                ? 'text-green-700'
                : 'text-sky-700'
            }`}>
              {dirLabel}
              {status.tideDirection !== 'slack' && (
                <span className="text-slate-500">
                  {' '}{status.currentSpeedKnots.toFixed(1)} kts
                </span>
              )}
            </span>
          </div>
          <div className="mt-1 text-sm text-slate-500">
            {nextLabel} {status.nextEventHeight.toFixed(1)}ft at{' '}
            {format(status.nextEventTime, 'h:mm a')}
            <span className="text-slate-400">
              {' '}({status.minutesToNextEvent > 0
                ? `in ${formatDuration(status.minutesToNextEvent)}`
                : 'now'})
            </span>
          </div>
          <div className="mt-1.5">
            <WindIndicator
              speedKnots={status.windSpeedKnots}
              gustKnots={status.windGustKnots}
              directionDeg={status.windDirectionDeg}
              cardinal={status.windDirectionCardinal}
              isOpposing={status.isWindAgainstCurrent}
            />
          </div>
        </div>
        <div className="shrink-0 pt-0.5">
          <SafetyBadge level={status.safetyLevel} compact />
        </div>
      </div>

      {/* Best daylight transit window */}
      {status.bestDaylightWindow && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-sky-800 bg-sky-50 border border-sky-200 rounded-lg px-2.5 py-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-sky-600">
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
            <span className="font-semibold">Best transit:</span>{' '}
            {status.bestDaylightWindow.label}
          </span>
        </div>
      )}

      {/* Slack water status banners */}
      {status.minutesToSlack !== null && status.minutesToSlack > 0 && !status.bestDaylightWindow && (
        <div className="mt-2 text-xs text-green-700 bg-green-50 rounded-md px-2 py-1">
          Next slack in {formatDuration(status.minutesToSlack)}
        </div>
      )}
      {status.minutesToSlack === 0 && (
        <div className="mt-2 text-xs text-green-800 bg-green-100 rounded-md px-2 py-1 font-semibold">
          Slack water NOW — safe transit window
        </div>
      )}

      {/* Tap affordance */}
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 -mb-1">
        <span className="text-[11px] font-medium text-sky-600">
          Transit planner & details
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400">
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
