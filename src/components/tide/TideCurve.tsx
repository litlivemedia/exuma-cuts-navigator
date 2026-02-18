import { useMemo } from 'react'
import { format } from 'date-fns'
import type { HiLo } from '../../types/tide.ts'
import {
  applyOffset,
  generateTideCurve,
  getSlackWindows,
} from '../../services/tideCalculator.ts'

const WIDTH = 360
const HEIGHT = 120
const PADDING = { top: 20, right: 10, bottom: 25, left: 35 }
const PLOT_W = WIDTH - PADDING.left - PADDING.right
const PLOT_H = HEIGHT - PADDING.top - PADDING.bottom

export function TideCurve({
  nassauTides,
  offsetMinutes,
  now,
}: {
  nassauTides: HiLo[]
  offsetMinutes: number
  now: Date
}) {
  const adjusted = useMemo(
    () => applyOffset(nassauTides, offsetMinutes),
    [nassauTides, offsetMinutes]
  )

  const startTime = useMemo(() => {
    const start = new Date(now)
    start.setHours(start.getHours() - 2, 0, 0, 0)
    return start
  }, [now])

  const hours = 14
  const curve = useMemo(
    () => generateTideCurve(adjusted, startTime, hours, 6),
    [adjusted, startTime, hours]
  )

  const slackWindows = useMemo(() => getSlackWindows(adjusted), [adjusted])

  if (curve.length === 0) return null

  const minH = Math.min(...curve.map((p) => p.height), 0)
  const maxH = Math.max(...curve.map((p) => p.height), 3)
  const range = maxH - minH || 1

  const startMs = startTime.getTime()
  const endMs = startMs + hours * 3600000

  function xScale(time: Date) {
    return PADDING.left + ((time.getTime() - startMs) / (endMs - startMs)) * PLOT_W
  }
  function yScale(h: number) {
    return PADDING.top + PLOT_H - ((h - minH) / range) * PLOT_H
  }

  const pathD = curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(p.time).toFixed(1)},${yScale(p.height).toFixed(1)}`)
    .join(' ')

  // Hi/Lo labels within the visible window
  const visibleEvents = adjusted.filter(
    (e) => e.time.getTime() >= startMs && e.time.getTime() <= endMs
  )

  // Now line
  const nowX = xScale(now)

  // Hour ticks
  const hourTicks: { x: number; label: string }[] = []
  for (let h = 0; h <= hours; h += 2) {
    const tickTime = new Date(startMs + h * 3600000)
    hourTicks.push({ x: xScale(tickTime), label: format(tickTime, 'ha').toLowerCase() })
  }

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Slack windows */}
      {slackWindows.map((sw, i) => {
        const x1 = Math.max(PADDING.left, xScale(sw.start))
        const x2 = Math.min(WIDTH - PADDING.right, xScale(sw.end))
        if (x2 <= PADDING.left || x1 >= WIDTH - PADDING.right) return null
        return (
          <rect
            key={i}
            x={x1}
            y={PADDING.top}
            width={x2 - x1}
            height={PLOT_H}
            fill="#bbf7d0"
            opacity={0.5}
          />
        )
      })}

      {/* Zero line */}
      <line
        x1={PADDING.left}
        y1={yScale(0)}
        x2={WIDTH - PADDING.right}
        y2={yScale(0)}
        stroke="#94a3b8"
        strokeWidth={0.5}
        strokeDasharray="3,3"
      />

      {/* Curve */}
      <path d={pathD} fill="none" stroke="#0369a1" strokeWidth={2} />

      {/* Now line */}
      {nowX >= PADDING.left && nowX <= WIDTH - PADDING.right && (
        <line
          x1={nowX}
          y1={PADDING.top}
          x2={nowX}
          y2={PADDING.top + PLOT_H}
          stroke="#dc2626"
          strokeWidth={1.5}
          strokeDasharray="4,2"
        />
      )}

      {/* Hi/Lo labels */}
      {visibleEvents.map((e, i) => (
        <g key={i}>
          <circle cx={xScale(e.time)} cy={yScale(e.height)} r={3} fill={e.type === 'H' ? '#0369a1' : '#64748b'} />
          <text
            x={xScale(e.time)}
            y={e.type === 'H' ? yScale(e.height) - 6 : yScale(e.height) + 12}
            textAnchor="middle"
            className="text-[8px] fill-slate-700 font-medium"
          >
            {e.type === 'H' ? 'H' : 'L'} {e.height.toFixed(1)}ft
          </text>
          <text
            x={xScale(e.time)}
            y={e.type === 'H' ? yScale(e.height) - 14 : yScale(e.height) + 20}
            textAnchor="middle"
            className="text-[7px] fill-slate-500"
          >
            {format(e.time, 'h:mma').toLowerCase()}
          </text>
        </g>
      ))}

      {/* Y axis labels */}
      {[0, 1, 2, 3].filter((v) => v >= minH && v <= maxH).map((v) => (
        <text key={v} x={PADDING.left - 4} y={yScale(v) + 3} textAnchor="end" className="text-[8px] fill-slate-400">
          {v}ft
        </text>
      ))}

      {/* X axis hour labels */}
      {hourTicks.map((t, i) => (
        <text key={i} x={t.x} y={HEIGHT - 4} textAnchor="middle" className="text-[8px] fill-slate-400">
          {t.label}
        </text>
      ))}
    </svg>
  )
}
