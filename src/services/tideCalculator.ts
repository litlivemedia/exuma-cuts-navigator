import { addMinutes, differenceInMinutes } from 'date-fns'
import type { HiLo, TideDirection } from '../types/tide.ts'
import { SLACK_WINDOW_MINUTES } from '../data/constants.ts'

export function applyOffset(predictions: HiLo[], offsetMinutes: number): HiLo[] {
  return predictions.map((p) => ({
    ...p,
    time: addMinutes(p.time, offsetMinutes),
  }))
}

export function interpolateTideHeight(
  prev: HiLo,
  next: HiLo,
  targetTime: Date
): number {
  const totalMs = next.time.getTime() - prev.time.getTime()
  const elapsedMs = targetTime.getTime() - prev.time.getTime()
  if (totalMs <= 0) return prev.height
  const fraction = Math.max(0, Math.min(1, elapsedMs / totalMs))
  const cosValue = (1 - Math.cos(fraction * Math.PI)) / 2
  return prev.height + (next.height - prev.height) * cosValue
}

export function findSurroundingEvents(
  predictions: HiLo[],
  targetTime: Date
): { prev: HiLo; next: HiLo } | null {
  const targetMs = targetTime.getTime()

  for (let i = 0; i < predictions.length - 1; i++) {
    if (
      predictions[i].time.getTime() <= targetMs &&
      predictions[i + 1].time.getTime() > targetMs
    ) {
      return { prev: predictions[i], next: predictions[i + 1] }
    }
  }

  // If before first prediction, use first two
  if (predictions.length >= 2 && targetMs < predictions[0].time.getTime()) {
    return { prev: predictions[0], next: predictions[1] }
  }

  // If after last prediction, use last two
  if (predictions.length >= 2) {
    return {
      prev: predictions[predictions.length - 2],
      next: predictions[predictions.length - 1],
    }
  }

  return null
}

export function getCurrentDirection(
  predictions: HiLo[],
  targetTime: Date
): TideDirection {
  const surrounding = findSurroundingEvents(predictions, targetTime)
  if (!surrounding) return 'slack'

  const { prev, next } = surrounding

  // Check if within slack window of either event
  const minsToPrev = Math.abs(differenceInMinutes(targetTime, prev.time))
  const minsToNext = Math.abs(differenceInMinutes(targetTime, next.time))

  if (minsToPrev <= SLACK_WINDOW_MINUTES || minsToNext <= SLACK_WINDOW_MINUTES) {
    return 'slack'
  }

  // Rising (low -> high) = flooding, falling (high -> low) = ebbing
  if (next.height > prev.height) return 'flooding'
  return 'ebbing'
}

export function estimateCurrentKnots(
  prev: HiLo,
  next: HiLo,
  targetTime: Date,
  maxCurrentKnots: number
): number {
  const totalMs = next.time.getTime() - prev.time.getTime()
  const elapsedMs = targetTime.getTime() - prev.time.getTime()
  if (totalMs <= 0) return 0

  const fraction = Math.max(0, Math.min(1, elapsedMs / totalMs))
  const hour = Math.floor(fraction * 6)
  const twelfths = [1, 2, 3, 3, 2, 1]
  const rate = twelfths[Math.min(hour, 5)] / 3
  return rate * maxCurrentKnots
}

export function getNextEvent(
  predictions: HiLo[],
  targetTime: Date
): HiLo | null {
  const targetMs = targetTime.getTime()
  for (const p of predictions) {
    if (p.time.getTime() > targetMs) return p
  }
  return null
}

export interface SlackWindow {
  center: Date
  start: Date
  end: Date
  type: 'H' | 'L'
}

export function getSlackWindows(predictions: HiLo[]): SlackWindow[] {
  return predictions.map((p) => ({
    center: p.time,
    start: addMinutes(p.time, -SLACK_WINDOW_MINUTES),
    end: addMinutes(p.time, SLACK_WINDOW_MINUTES),
    type: p.type,
  }))
}

export function getNextSlackWindow(
  predictions: HiLo[],
  targetTime: Date
): SlackWindow | null {
  const windows = getSlackWindows(predictions)
  const targetMs = targetTime.getTime()

  for (const w of windows) {
    // Currently in this window
    if (targetMs >= w.start.getTime() && targetMs <= w.end.getTime()) {
      return w
    }
    // Window is in the future
    if (w.start.getTime() > targetMs) {
      return w
    }
  }
  return null
}

// Bahamas daylight: roughly 6:30am to 6:30pm year-round
const DAYLIGHT_START_HOUR = 6.5
const DAYLIGHT_END_HOUR = 18.5

function isDaylight(date: Date): boolean {
  const hour = date.getHours() + date.getMinutes() / 60
  return hour >= DAYLIGHT_START_HOUR && hour <= DAYLIGHT_END_HOUR
}

export function getDaylightSlackWindows(
  predictions: HiLo[],
  now: Date
): SlackWindow[] {
  const windows = getSlackWindows(predictions)
  return windows.filter(
    (w) => w.end.getTime() > now.getTime() && isDaylight(w.center)
  )
}

export function generateTideCurve(
  predictions: HiLo[],
  startTime: Date,
  hours: number,
  pointsPerHour: number = 4
): { time: Date; height: number }[] {
  const points: { time: Date; height: number }[] = []
  const totalPoints = hours * pointsPerHour

  for (let i = 0; i <= totalPoints; i++) {
    const time = addMinutes(startTime, i * (60 / pointsPerHour))
    const surrounding = findSurroundingEvents(predictions, time)
    if (surrounding) {
      points.push({
        time,
        height: interpolateTideHeight(surrounding.prev, surrounding.next, time),
      })
    }
  }

  return points
}
