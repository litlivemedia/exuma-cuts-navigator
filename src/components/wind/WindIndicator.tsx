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
    <div className={`flex items-center gap-2 text-sm ${isOpposing ? 'text-red-700 font-semibold' : 'text-slate-600'}`}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        className="shrink-0"
        style={{ transform: `rotate(${arrowRotation}deg)` }}
      >
        <path
          d="M10 2 L14 14 L10 11 L6 14 Z"
          fill="currentColor"
        />
      </svg>
      <span>
        {cardinal} {Math.round(speedKnots)} kts
        {gustKnots > speedKnots + 5 && (
          <span className="text-slate-400"> G{Math.round(gustKnots)}</span>
        )}
      </span>
      {isOpposing && (
        <span className="text-red-600 text-xs font-bold">OPPOSING</span>
      )}
    </div>
  )
}
