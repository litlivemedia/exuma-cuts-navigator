import { useEffect } from 'react'
import { format } from 'date-fns'
import type { HiLo } from '../../types/tide.ts'
import type { WindHourly } from '../../types/wind.ts'
import type { MarineHourly } from '../../types/marine.ts'
import type { CutStatus } from '../../types/cut.ts'
import { TideCurve } from '../tide/TideCurve.tsx'
import { TransitPlanner } from '../transit/TransitPlanner.tsx'
import { applyOffset } from '../../services/tideCalculator.ts'
import { getMarineAtTime } from '../../services/marine.ts'
import { degreesToCardinal } from '../../services/wind.ts'

export function CutDetail({
  status,
  nassauTides,
  windData,
  marineData,
  now,
  onBack,
}: {
  status: CutStatus
  nassauTides: HiLo[]
  windData: WindHourly[]
  marineData: MarineHourly[]
  now: Date
  onBack: () => void
}) {
  // Scroll to top when entering detail view
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [status.cut.id])

  const adjusted = applyOffset(nassauTides, status.cut.offsetMinutes)

  // Upcoming events for next 24h
  const upcoming = adjusted.filter(
    (e) =>
      e.time.getTime() > now.getTime() &&
      e.time.getTime() < now.getTime() + 24 * 3600000
  )

  // === Helpers (identical to CutCard.tsx) ===
  const depth = status.depthNowFt
  const isOpposing = status.isWindAgainstCurrent
  const isHazardous = status.safetyLevel === 'hazardous'
  const isCaution = status.safetyLevel === 'caution'

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

  const depthColor =
    depth != null && depth < 5
      ? 'text-red-600'
      : depth != null && depth < 6
        ? 'text-amber-600'
        : 'text-slate-900'

  const safetyCfg = {
    safe:      { dot: 'bg-emerald-500', label: 'Safe',      text: 'text-emerald-600' },
    caution:   { dot: 'bg-amber-500',   label: 'Caution',   text: 'text-amber-600' },
    hazardous: { dot: 'bg-red-500',     label: 'Hazardous', text: 'text-red-600' },
  }[status.safetyLevel]

  // Wave data (area-wide, closest hour)
  const wave = getMarineAtTime(marineData, now)

  return (
    <div className={`min-h-screen bg-white ${
      isOpposing && isHazardous
        ? 'border-t-[3px] border-t-red-500'
        : isOpposing && isCaution
          ? 'border-t-[3px] border-t-amber-500'
          : ''
    }`}>
      {/* ── Slim Header ── */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="px-5 pt-4 pb-3">
          <button
            onClick={onBack}
            className="text-sky-600 text-sm font-medium active:text-sky-800 -ml-1"
          >
            &larr; All Cuts
          </button>
          <div className="flex items-center justify-between mt-1">
            <h2 className="text-[17px] font-semibold text-slate-900 tracking-tight">
              {status.cut.name}
            </h2>
            <span className={`flex items-center gap-1.5 text-xs font-medium ${safetyCfg.text}`}>
              <span className={`w-2 h-2 rounded-full ${safetyCfg.dot}`} />
              {safetyCfg.label}
            </span>
          </div>
          <p className="text-[13px] text-slate-400 mt-0.5">
            Offset: {status.cut.offsetMinutes > 0 ? '+' : ''}{status.cut.offsetMinutes} min vs Nassau
          </p>
        </div>
      </div>

      {/* ── Hero: Depth + Direction ── */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-baseline justify-between">
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

        {/* Depth bar (depth-critical cuts only) */}
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

        <p className="text-[13px] text-slate-400 mt-2">
          Tide height: {status.heightFt.toFixed(1)} ft
        </p>
      </div>

      {/* ── Conditions Summary ── */}
      <div className="px-5 py-3">
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
          Current Conditions
        </h3>
        <div className="text-[13px] text-slate-600 leading-relaxed space-y-1.5">
          {/* Tide & Current */}
          <p>
            {status.tideDirection === 'slack' ? (
              <>The tide is at <span className="font-medium text-emerald-600">slack water</span> — minimal current, ideal for transit.</>
            ) : (
              <>The tide is <span className="font-medium">{status.tideDirection === 'flooding' ? 'flooding' : 'ebbing'}</span> with
              a {status.currentSpeedKnots.toFixed(1)}-knot current flowing {status.tideDirection === 'flooding' ? 'westward onto the bank' : 'eastward into Exuma Sound'}.
              Tide height is {status.heightFt.toFixed(1)} ft{depth != null && <>, giving an estimated depth of <span className={`font-medium ${depthColor}`}>{depth.toFixed(1)} feet</span></>}.</>
            )}
          </p>

          {/* Wind */}
          <p>
            Winds are from the {status.windDirectionCardinal} at {Math.round(status.windSpeedKnots)} knots{status.windGustKnots > status.windSpeedKnots + 5 && <>, gusting to {Math.round(status.windGustKnots)}</>}.{' '}
            {isOpposing ? (
              <span className="text-red-600 font-medium">
                This is opposing the {status.tideDirection === 'ebbing' ? 'eastward ebb' : 'westward flood'} current — expect steep, confused seas in the cut.
              </span>
            ) : status.windSpeedKnots < 10 ? (
              'Light winds — favorable for transit.'
            ) : status.windSpeedKnots < 15 ? (
              'Moderate winds — manageable in most conditions.'
            ) : (
              'Strong winds — use caution even at slack.'
            )}
          </p>

          {/* Waves */}
          {wave && wave.waveHeightFt > 0 && (
            <p>
              Seas are {wave.waveHeightFt.toFixed(1)} feet from the {degreesToCardinal(wave.waveDirectionDeg)} with
              a {wave.wavePeriodSec.toFixed(0)}-second period
              {wave.swellHeightFt > 0.3 && wave.windWaveHeightFt > 0.3
                ? ` (${wave.windWaveHeightFt.toFixed(1)}ft wind waves, ${wave.swellHeightFt.toFixed(1)}ft swell)`
                : wave.swellHeightFt > 0.3
                  ? `, mostly swell`
                  : wave.windWaveHeightFt > 0.3
                    ? `, mostly wind-driven`
                    : ''
              }.{' '}
              {wave.wavePeriodSec < 5
                ? 'Short period chop — uncomfortable but manageable at slack.'
                : wave.wavePeriodSec < 8
                  ? 'Moderate period — typical trade wind seas.'
                  : 'Longer period swell — watch for shoaling in the cut.'}
            </p>
          )}
        </div>

        {/* Safety callout */}
        {status.safetyReasons.length > 0 && (
          <div className={`mt-3 rounded-lg px-3 py-2 ${
            isHazardous ? 'bg-red-50' : isCaution ? 'bg-amber-50' : 'bg-slate-50'
          }`}>
            {status.safetyReasons.map((r, i) => (
              <p
                key={i}
                className={`text-[13px] leading-relaxed ${
                  isHazardous ? 'text-red-700' : isCaution ? 'text-amber-700' : 'text-slate-600'
                }`}
              >
                {r}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="mx-5 border-t border-slate-100" />

      {/* ── Transit Planner ── */}
      <div className="px-5 pt-4">
        <TransitPlanner
          cut={status.cut}
          nassauTides={nassauTides}
          windData={windData}
          marineData={marineData}
          now={now}
        />
      </div>

      {/* ── Tide Curve ── */}
      <div className="px-5 pt-4">
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
          Tide Curve
        </h3>
        <TideCurve
          nassauTides={nassauTides}
          offsetMinutes={status.cut.offsetMinutes}
          now={now}
        />
        <p className="text-[11px] text-slate-300 mt-1.5">
          Green = slack water. Red line = now.
        </p>
      </div>

      {/* ── Upcoming Tides ── */}
      <div className="px-5 pt-4">
        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
          Upcoming Tides
        </h3>
        <div className="space-y-2.5">
          {upcoming.map((e, i) => (
            <div key={i} className="flex justify-between text-[13px]">
              <span className="text-slate-600">
                {e.type === 'H' ? 'High' : 'Low'} — {e.height.toFixed(1)} ft
              </span>
              <span className="text-slate-400">
                {format(e.time, 'h:mm a')}
              </span>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="text-[13px] text-slate-300">No tide events in next 24 hours</p>
          )}
        </div>
      </div>

      {/* ── Notes ── */}
      <div className="px-5 pt-4 pb-24">
        <p className="text-[11px] text-slate-300 leading-relaxed">{status.cut.notes}</p>
        <p className="text-[11px] text-slate-300 leading-relaxed mt-2">
          Offsets are estimates. Always assess conditions visually before transiting.
        </p>
      </div>
    </div>
  )
}
