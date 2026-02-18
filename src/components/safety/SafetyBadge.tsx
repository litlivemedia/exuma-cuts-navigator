import type { SafetyLevel } from '../../types/cut.ts'

const config: Record<SafetyLevel, { bg: string; text: string; label: string; icon: string }> = {
  safe: { bg: 'bg-green-100', text: 'text-green-800', label: 'Safe', icon: '\u2713' },
  caution: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Caution', icon: '\u26A0' },
  hazardous: { bg: 'bg-red-100', text: 'text-red-800', label: 'Hazardous', icon: '\u2716' },
}

export function SafetyBadge({ level, compact }: { level: SafetyLevel; compact?: boolean }) {
  const c = config[level]
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
        <span>{c.icon}</span>
        {c.label}
      </span>
    )
  }
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${c.bg} ${c.text} font-semibold`}>
      <span className="text-lg">{c.icon}</span>
      <span>{c.label}</span>
    </div>
  )
}
