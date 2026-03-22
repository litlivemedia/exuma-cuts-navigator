import type { Activity, ActivityCondition } from '../../types/activity.ts'

const conditionCfg: Record<ActivityCondition, { dot: string; label: string; text: string }> = {
  ideal: { dot: 'bg-emerald-500', label: 'Ideal', text: 'text-emerald-600' },
  good: { dot: 'bg-sky-500', label: 'Good', text: 'text-sky-600' },
  fair: { dot: 'bg-amber-500', label: 'Fair', text: 'text-amber-600' },
  poor: { dot: 'bg-slate-400', label: 'Poor', text: 'text-slate-500' },
}

export function ActivityCard({
  activity,
  condition,
  reasons,
  onSelect,
}: {
  activity: Activity
  condition: ActivityCondition
  reasons: string[]
  onSelect: () => void
}) {
  const cfg = conditionCfg[condition]

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left bg-white rounded-2xl border shadow-sm p-4 active:scale-[0.995] transition-transform ${
        condition === 'ideal'
          ? 'border-emerald-300'
          : condition === 'good'
            ? 'border-sky-200'
            : 'border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{activity.icon}</span>
          <div>
            <h3 className="font-semibold text-slate-900 text-[15px] leading-tight">
              {activity.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{activity.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
        </div>
      </div>

      {/* Condition reasons */}
      <div className="mt-3 space-y-1">
        {reasons.map((r, i) => (
          <p key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
            <span className="text-slate-400 mt-px">
              {condition === 'ideal' || condition === 'good' ? '✓' : '·'}
            </span>
            {r}
          </p>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-xs text-sky-600 font-medium">View Guide</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  )
}
