import type { CutStatus } from '../types/cut.ts'
import type { MarineDaily } from '../types/marine.ts'
import { CutCard } from '../components/cuts/CutCard.tsx'
import { WeatherBriefing } from '../components/weather/WeatherBriefing.tsx'

const GROUP_LABELS: Record<string, string> = {
  exuma: 'Exuma Cuts',
  raggeds: 'Off to The Raggeds',
}

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

  const sections = [
    { key: 'exuma', label: GROUP_LABELS.exuma, cuts: exumaCuts },
    { key: 'raggeds', label: GROUP_LABELS.raggeds, cuts: raggedsCuts },
  ].filter((s) => s.cuts.length > 0)

  return (
    <div className="pl-4 pr-6 py-4 pb-24 space-y-2">
      {/* Weather briefing — one for the whole chain */}
      {dailyForecasts.length > 0 && (
        <div className="mb-3">
          <WeatherBriefing forecasts={dailyForecasts} />
        </div>
      )}

      {sections.map((section) => (
        <div key={section.key}>
          <div className="flex items-center gap-2 px-1 pt-2 pb-2">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              {section.label}
            </h2>
            <div className="flex-1 h-px bg-slate-300" />
            <StatusSummary cuts={section.cuts} />
          </div>
          <div className="space-y-3">
            {section.cuts.map((s) => (
              <CutCard
                key={s.cut.id}
                status={s}
                onSelect={() => onSelect(s.cut.id)}
              />
            ))}
          </div>
        </div>
      ))}

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
