import { useMemo } from 'react'
import { activities } from '../data/activities.ts'
import { cuts } from '../data/cuts.ts'
import { assessActivity } from '../services/activityEngine.ts'
import { ActivityCard } from '../components/activities/ActivityCard.tsx'
import type { HiLo } from '../types/tide.ts'
import type { WindHourly } from '../types/wind.ts'

export function ActivitiesView({
  tides,
  wind,
  now,
  onSelect,
}: {
  tides: HiLo[] | null
  wind: WindHourly[] | null
  now: Date
  onSelect: (id: string) => void
}) {
  const assessments = useMemo(() => {
    if (!tides || !wind) return []
    return activities.map((activity) => {
      const cut = cuts.find((c) => c.id === activity.nearestCutId)
      const offset = cut?.offsetMinutes ?? 0
      const assessment = assessActivity(activity, tides, wind, now, offset)
      return { activity, ...assessment }
    })
  }, [tides, wind, now])

  return (
    <div className="p-4 pb-24 space-y-3">
      <div className="mb-1">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Tide-Dependent Activities
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Conditions assessed based on current tides, wind, and seas
        </p>
      </div>

      {assessments.map(({ activity, condition, reasons }) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          condition={condition}
          reasons={reasons}
          onSelect={() => onSelect(activity.id)}
        />
      ))}

      <p className="text-[11px] text-slate-400 text-center pt-2">
        More activities coming soon — submit suggestions via the Info tab
      </p>
    </div>
  )
}
