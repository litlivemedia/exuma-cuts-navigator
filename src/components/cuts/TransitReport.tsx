import { useState } from 'react'
import { format } from 'date-fns'
import type { CutDefinition } from '../../types/cut.ts'

interface TransitReportProps {
  cut: CutDefinition
  onClose: () => void
}

export function TransitReport({ cut, onClose }: TransitReportProps) {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill time with current time
  const [transitTime, setTransitTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [direction, setDirection] = useState<'eastbound' | 'westbound'>('eastbound')
  const [currentStrength, setCurrentStrength] = useState('')
  const [currentDirection, setCurrentDirection] = useState<'with' | 'against' | 'slack'>('with')
  const [slackObserved, setSlackObserved] = useState('')
  const [depth, setDepth] = useState('')
  const [windConditions, setWindConditions] = useState('')
  const [seaConditions, setSeaConditions] = useState<'calm' | 'light-chop' | 'moderate' | 'rough' | ''>('')
  const [notes, setNotes] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const formData = new URLSearchParams()
    formData.append('form-name', 'transit-report')
    formData.append('cutId', cut.id)
    formData.append('cutName', cut.name)
    formData.append('transitTime', transitTime)
    formData.append('direction', direction)
    formData.append('currentStrength', currentStrength)
    formData.append('currentDirection', currentDirection)
    formData.append('slackObserved', slackObserved)
    formData.append('depth', depth)
    formData.append('windConditions', windConditions)
    formData.append('seaConditions', seaConditions)
    formData.append('notes', notes)

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Submission failed — try again later.')
      }
    } catch {
      setError('Network error — are you online?')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-emerald-50 rounded-xl p-5 text-center">
        <div className="text-2xl mb-2">✓</div>
        <h3 className="text-[15px] font-semibold text-emerald-800">Report Submitted</h3>
        <p className="text-[13px] text-emerald-600 mt-1">
          Thanks! Your observation helps improve slack predictions for {cut.name}.
        </p>
        <button
          onClick={onClose}
          className="mt-4 text-[13px] font-medium text-emerald-700 underline"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-slate-800">
          Report Transit — {cut.name}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-lg leading-none"
        >
          ✕
        </button>
      </div>

      <p className="text-[12px] text-slate-400 mb-4">
        Your observations help us calibrate when the current actually reverses vs. the predicted tide.
      </p>

      <div className="space-y-3">
        {/* Transit time */}
        <label className="block">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">
            Transit Time
          </span>
          <input
            type="datetime-local"
            value={transitTime}
            onChange={(e) => setTransitTime(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-slate-700 bg-white"
          />
        </label>

        {/* Direction */}
        <label className="block">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">
            Direction of Travel
          </span>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as 'eastbound' | 'westbound')}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-slate-700 bg-white"
          >
            <option value="eastbound">Eastbound (toward Exuma Sound)</option>
            <option value="westbound">Westbound (onto the bank)</option>
          </select>
        </label>

        {/* Current strength */}
        <label className="block">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">
            Current Strength (knots, if known)
          </span>
          <input
            type="number"
            step="0.1"
            min="0"
            max="8"
            value={currentStrength}
            onChange={(e) => setCurrentStrength(e.target.value)}
            placeholder="e.g., 1.5"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-slate-700 bg-white"
          />
        </label>

        {/* Current with/against */}
        <label className="block">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">
            Current Was...
          </span>
          <select
            value={currentDirection}
            onChange={(e) => setCurrentDirection(e.target.value as 'with' | 'against' | 'slack')}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-slate-700 bg-white"
          >
            <option value="with">With me (helping)</option>
            <option value="against">Against me (opposing)</option>
            <option value="slack">Slack / no current</option>
          </select>
        </label>

        {/* Slack observed time */}
        <label className="block">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">
            When did you observe slack? (optional)
          </span>
          <input
            type="time"
            value={slackObserved}
            onChange={(e) => setSlackObserved(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-slate-700 bg-white"
          />
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            This is the most valuable data point for improving predictions
          </span>
        </label>

        {/* Depth */}
        <label className="block">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">
            Depth Reading (ft, optional)
          </span>
          <input
            type="number"
            step="0.1"
            min="0"
            max="50"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
            placeholder="e.g., 10.5"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-slate-700 bg-white"
          />
        </label>

        {/* Wind */}
        <label className="block">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">
            Wind (optional)
          </span>
          <input
            type="text"
            value={windConditions}
            onChange={(e) => setWindConditions(e.target.value)}
            placeholder="e.g., SE 12 kts"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-slate-700 bg-white"
          />
        </label>

        {/* Sea conditions */}
        <label className="block">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">
            Sea Conditions
          </span>
          <select
            value={seaConditions}
            onChange={(e) => setSeaConditions(e.target.value as typeof seaConditions)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-slate-700 bg-white"
          >
            <option value="">— select —</option>
            <option value="calm">Calm / flat</option>
            <option value="light-chop">Light chop</option>
            <option value="moderate">Moderate / manageable</option>
            <option value="rough">Rough / square waves</option>
          </select>
        </label>

        {/* Notes */}
        <label className="block">
          <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">
            Notes (optional)
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anything else — e.g., 'current reversed about 30 min before predicted high'"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-[14px] text-slate-700 bg-white resize-none"
          />
        </label>
      </div>

      {error && (
        <p className="mt-3 text-[13px] text-red-600 font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full bg-sky-600 text-white font-medium text-[14px] py-2.5 rounded-lg active:bg-sky-700 disabled:opacity-50 transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  )
}
