import { useEffect } from 'react'
import { format } from 'date-fns'
import type { HiLo } from '../../types/tide.ts'
import type { WindHourly } from '../../types/wind.ts'
import type { CutStatus } from '../../types/cut.ts'
import { SafetyBadge } from '../safety/SafetyBadge.tsx'
import { WindIndicator } from '../wind/WindIndicator.tsx'
import { CurrentStrength } from '../tide/CurrentStrength.tsx'
import { TideCurve } from '../tide/TideCurve.tsx'
import { TransitPlanner } from '../transit/TransitPlanner.tsx'
import { ShipwreckFact } from '../fun/ShipwreckFact.tsx'
import { applyOffset, getSlackWindows } from '../../services/tideCalculator.ts'

export function CutDetail({
  status,
  nassauTides,
  windData,
  now,
  onBack,
}: {
  status: CutStatus
  nassauTides: HiLo[]
  windData: WindHourly[]
  now: Date
  onBack: () => void
}) {
  // Scroll to top when entering detail view
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [status.cut.id])

  const adjusted = applyOffset(nassauTides, status.cut.offsetMinutes)
  const slackWindows = getSlackWindows(adjusted)

  // Show upcoming events for next 24h
  const upcoming = adjusted.filter(
    (e) =>
      e.time.getTime() > now.getTime() &&
      e.time.getTime() < now.getTime() + 24 * 3600000
  )

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-sky-900 text-white pl-4 pr-6 py-3 z-10">
        <button onClick={onBack} className="text-sky-200 text-sm mb-1 active:text-white">
          &larr; All Cuts
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{status.cut.name}</h2>
          <SafetyBadge level={status.safetyLevel} compact />
        </div>
        <p className="text-sky-200 text-xs mt-0.5">
          Offset: {status.cut.offsetMinutes > 0 ? '+' : ''}{status.cut.offsetMinutes} min vs Nassau
        </p>
        <ShipwreckFact />
      </div>

      <div className="pl-4 pr-6 py-4 space-y-4">
        {/* Safety reasons */}
        <div className={`rounded-lg p-3 ${
          status.safetyLevel === 'hazardous'
            ? 'bg-red-50 border border-red-200'
            : status.safetyLevel === 'caution'
              ? 'bg-amber-50 border border-amber-200'
              : 'bg-green-50 border border-green-200'
        }`}>
          {status.safetyReasons.map((r, i) => (
            <p key={i} className="text-sm">{r}</p>
          ))}
        </div>

        {/* Current status */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Current
          </h3>
          <CurrentStrength
            speedKnots={status.currentSpeedKnots}
            maxKnots={status.cut.maxCurrentKnots}
            direction={status.tideDirection}
          />
          <div className="text-sm text-slate-600">
            Tide height: {status.heightFt.toFixed(1)} ft
          </div>
        </div>

        {/* Wind */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Wind
          </h3>
          <WindIndicator
            speedKnots={status.windSpeedKnots}
            gustKnots={status.windGustKnots}
            directionDeg={status.windDirectionDeg}
            cardinal={status.windDirectionCardinal}
            isOpposing={status.isWindAgainstCurrent}
          />
          {status.isWindAgainstCurrent && (
            <p className="text-xs text-red-700 mt-1">
              Wind from {status.windDirectionCardinal} is opposing the{' '}
              {status.tideDirection === 'ebbing' ? 'eastward ebb' : 'westward flood'} current.
              Expect steep, confused seas in the cut.
            </p>
          )}
        </div>

        {/* ═══ TRANSIT PLANNER ═══ */}
        <TransitPlanner
          cut={status.cut}
          nassauTides={nassauTides}
          windData={windData}
          now={now}
        />

        {/* Tide curve */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Tide Curve
          </h3>
          <TideCurve
            nassauTides={nassauTides}
            offsetMinutes={status.cut.offsetMinutes}
            now={now}
          />
          <p className="text-xs text-slate-400 mt-1">
            Green bands = slack water windows. Red line = now.
          </p>
        </div>

        {/* Upcoming tides */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Next 24 Hours
          </h3>
          <div className="space-y-2">
            {upcoming.map((e, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-600">
                  {e.type === 'H' ? 'High' : 'Low'} — {e.height.toFixed(1)} ft
                </span>
                <span className="text-slate-500">
                  {format(e.time, 'h:mm a')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Slack windows */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
            Safe Transit Windows
          </h3>
          <div className="space-y-2">
            {slackWindows
              .filter((sw) => sw.end.getTime() > now.getTime())
              .slice(0, 6)
              .map((sw, i) => {
                const isCurrent =
                  now.getTime() >= sw.start.getTime() &&
                  now.getTime() <= sw.end.getTime()
                return (
                  <div
                    key={i}
                    className={`flex justify-between text-sm px-2 py-1 rounded ${
                      isCurrent ? 'bg-green-100 font-semibold text-green-800' : 'text-slate-600'
                    }`}
                  >
                    <span>
                      {sw.type === 'H' ? 'High' : 'Low'} slack
                      {isCurrent && ' (NOW)'}
                    </span>
                    <span>
                      {format(sw.start, 'h:mm')} – {format(sw.end, 'h:mm a')}
                    </span>
                  </div>
                )
              })}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            ~1 hour window centered on each high/low tide
          </p>
        </div>

        {/* Notes */}
        <div className="text-xs text-slate-400 p-2">
          <p>{status.cut.notes}</p>
          <p className="mt-2">
            Offsets are estimates based on available data. Always assess
            conditions visually before transiting any cut.
          </p>
        </div>
      </div>
    </div>
  )
}
