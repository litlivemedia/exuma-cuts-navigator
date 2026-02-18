import type { CutStatus } from '../types/cut.ts'
import { CutMap } from '../components/map/CutMap.tsx'

export function MapView({
  statuses,
  onSelect,
}: {
  statuses: CutStatus[]
  onSelect: (id: string) => void
}) {
  return (
    <div className="relative" style={{ height: 'calc(100dvh - 120px)' }}>
      <CutMap statuses={statuses} onSelect={onSelect} />
      <div className="absolute top-2 left-2 right-2 z-[1000]">
        <div className="bg-white/90 backdrop-blur rounded-lg px-3 py-1.5 text-xs text-slate-600 flex items-center gap-3 shadow-sm">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Safe
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Caution
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Hazardous
          </span>
        </div>
      </div>
    </div>
  )
}
