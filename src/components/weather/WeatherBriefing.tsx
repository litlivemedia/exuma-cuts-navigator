import { format } from 'date-fns'
import type { MarineDaily } from '../../types/marine.ts'
import { degreesToCardinal } from '../../services/wind.ts'

const SEA_STATE_LABELS: Record<MarineDaily['seaState'], string> = {
  calm: 'Calm',
  light: 'Light chop',
  moderate: 'Moderate',
  rough: 'Rough',
  'very rough': 'Very rough',
}

const SEA_STATE_COLORS: Record<MarineDaily['seaState'], string> = {
  calm: 'text-green-700 bg-green-100',
  light: 'text-green-700 bg-green-50',
  moderate: 'text-amber-700 bg-amber-50',
  rough: 'text-red-700 bg-red-100',
  'very rough': 'text-red-800 bg-red-200',
}

export function WeatherBriefing({
  forecasts,
}: {
  forecasts: MarineDaily[]
}) {
  if (forecasts.length === 0) return null

  const hasAnyWarning = forecasts.some((d) => d.isWarning)

  return (
    <div className={`rounded-xl border p-3 ${
      hasAnyWarning
        ? 'bg-slate-800 border-slate-700'
        : 'bg-slate-700 border-slate-600'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-300 shrink-0">
          <path d="M17.7 7.7a7.5 7.5 0 1 0-10.6 10.6" />
          <path d="M21 12h1M12 3v1M4.2 4.2l.7.7M3 12h1M4.2 19.8l.7-.7" />
          <path d="M18.5 12.2a5.5 5.5 0 1 0-6.3 6.3" />
          <path d="M20 16.6A2 2 0 0 0 18 15h-1.2a3 3 0 0 0-3 3v.4" />
          <path d="M22 21c0-1.1-.9-2-2-2h-1" />
        </svg>
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          3-Day Exuma Forecast
        </span>
      </div>

      {/* Day rows */}
      <div className="space-y-1">
        {forecasts.map((day) => (
          <DayRow key={day.label} day={day} />
        ))}
      </div>

      {/* Warning banners */}
      {forecasts.filter((d) => d.isWarning).map((day) => (
        <div
          key={`warn-${day.label}`}
          className={`mt-2 rounded-lg px-3 py-2 flex items-start gap-2 ${
            day.seaState === 'very rough'
              ? 'bg-red-600 text-white'
              : 'bg-amber-500 text-white'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div className="text-xs font-semibold leading-relaxed">
            <span className="font-bold">{day.label}:</span> {day.warningText}
          </div>
        </div>
      ))}

      <p className="text-[10px] text-slate-500 mt-2">
        ECMWF via Open-Meteo · Daylight hours
      </p>
    </div>
  )
}

function DayRow({ day }: { day: MarineDaily }) {
  const waveDir = degreesToCardinal(day.dominantWaveDirectionDeg)

  return (
    <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${
      day.isWarning ? 'bg-slate-900/50' : 'bg-slate-600/40'
    }`}>
      {/* Day label */}
      <div className="w-[72px] shrink-0">
        <div className="text-xs font-bold text-slate-200">{day.label}</div>
        {day.label !== 'Today' && (
          <div className="text-[10px] text-slate-400">{format(day.date, 'MMM d')}</div>
        )}
      </div>

      {/* Wind */}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-slate-300">
          <span className="font-semibold text-slate-200">
            {day.avgWindCardinal} {Math.round(day.maxWindSpeedKnots)}
          </span>
          {day.maxGustKnots > day.maxWindSpeedKnots + 3 && (
            <span className="text-slate-400">
              g{Math.round(day.maxGustKnots)}
            </span>
          )}
          <span className="text-slate-400">kts</span>
        </div>
        <div className="text-[10px] text-slate-400">
          Waves {day.maxWaveHeightFt.toFixed(1)}ft {waveDir}
          {day.avgWavePeriodSec > 0 && ` · ${day.avgWavePeriodSec.toFixed(0)}s`}
        </div>
      </div>

      {/* Sea state badge */}
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${SEA_STATE_COLORS[day.seaState]}`}>
        {SEA_STATE_LABELS[day.seaState]}
      </span>
    </div>
  )
}
