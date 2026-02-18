import type { TideDirection } from '../../types/tide.ts'

export function CurrentStrength({
  speedKnots,
  maxKnots,
  direction,
}: {
  speedKnots: number
  maxKnots: number
  direction: TideDirection
}) {
  const pct = maxKnots > 0 ? Math.min(100, (speedKnots / maxKnots) * 100) : 0

  const barColor =
    direction === 'slack'
      ? 'bg-green-400'
      : pct > 80
        ? 'bg-red-400'
        : pct > 50
          ? 'bg-amber-400'
          : 'bg-sky-400'

  const label =
    direction === 'slack'
      ? 'Slack'
      : direction === 'flooding'
        ? 'Flooding'
        : 'Ebbing'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span>{speedKnots.toFixed(1)} / {maxKnots} kts</span>
      </div>
      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
