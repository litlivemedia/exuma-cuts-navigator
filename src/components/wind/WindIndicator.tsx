export function WindIndicator({
  speedKnots,
  gustKnots,
  directionDeg,
  cardinal,
  isOpposing,
}: {
  speedKnots: number
  gustKnots: number
  directionDeg: number
  cardinal: string
  isOpposing: boolean
}) {
  // Arrow points in the direction wind is blowing TO (opposite of FROM)
  const arrowRotation = directionDeg + 180

  return (
    <div className={`flex items-center gap-2 ${isOpposing ? 'text-red-600' : 'text-slate-400'}`}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 20 20"
        className="shrink-0"
        style={{ transform: `rotate(${arrowRotation}deg)` }}
      >
        <path
          d="M10 2 L14 14 L10 11 L6 14 Z"
          fill="currentColor"
        />
      </svg>
      <span className={`text-[13px] ${isOpposing ? 'font-semibold' : 'font-medium'}`}>
        {cardinal} {Math.round(speedKnots)}kts
        {gustKnots > speedKnots + 5 && (
          <span className={isOpposing ? 'text-red-400' : 'text-slate-300'}> G{Math.round(gustKnots)}</span>
        )}
      </span>
      {isOpposing && (
        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">opposing</span>
      )}
    </div>
  )
}
