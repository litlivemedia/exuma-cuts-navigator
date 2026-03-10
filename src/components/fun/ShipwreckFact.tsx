import { useState, useCallback, useMemo } from 'react'
import { shipwrecks } from '../../data/shipwrecks.ts'
import { shipwreckQuotes } from '../../data/shipwreckQuotes.ts'

type FactType = 'wreck' | 'quote'

interface DisplayItem {
  type: FactType
  index: number
}

/** Pick a random item, avoiding the previous one */
function pickRandom(prev: DisplayItem | null): DisplayItem {
  const totalWrecks = shipwrecks.length
  const totalQuotes = shipwreckQuotes.length

  // 60% chance wreck, 40% quote
  const pickQuote = Math.random() < 0.4

  if (pickQuote) {
    let idx = Math.floor(Math.random() * totalQuotes)
    // Avoid repeating exact same item
    if (prev?.type === 'quote' && prev.index === idx) {
      idx = (idx + 1) % totalQuotes
    }
    return { type: 'quote', index: idx }
  } else {
    let idx = Math.floor(Math.random() * totalWrecks)
    if (prev?.type === 'wreck' && prev.index === idx) {
      idx = (idx + 1) % totalWrecks
    }
    return { type: 'wreck', index: idx }
  }
}

export function ShipwreckFact() {
  const [item, setItem] = useState<DisplayItem>(() => pickRandom(null))
  const [fading, setFading] = useState(false)

  const handleRefresh = useCallback(() => {
    setFading(true)
    setTimeout(() => {
      setItem((prev) => pickRandom(prev))
      setFading(false)
    }, 200)
  }, [])

  const content = useMemo(() => {
    if (item.type === 'wreck') {
      const w = shipwrecks[item.index]
      return { type: 'wreck' as const, wreck: w }
    } else {
      const q = shipwreckQuotes[item.index]
      return { type: 'quote' as const, quote: q }
    }
  }, [item])

  return (
    <div
      className={`mt-2.5 rounded-lg bg-sky-800/60 border border-sky-700/50 overflow-hidden transition-opacity duration-200 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between px-3 pt-2 pb-0.5">
        <div className="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-400/70">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          <span className="text-[10px] font-semibold text-sky-400/70 uppercase tracking-wider">
            A Cautionary Tale...
          </span>
        </div>
        <button
          onClick={handleRefresh}
          className="text-sky-400/50 hover:text-sky-300 active:text-sky-200 p-1 -mr-0.5 rounded transition-colors"
          aria-label="Show another"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-3 pb-2.5 pt-1">
        {content.type === 'wreck' ? (
          <WreckContent wreck={content.wreck} />
        ) : (
          <QuoteContent quote={content.quote} />
        )}
      </div>
    </div>
  )
}

function WreckContent({ wreck }: { wreck: (typeof shipwrecks)[number] }) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-0.5">
        <span className="text-sm font-bold text-sky-100">{wreck.name}</span>
        <span className="text-xs text-sky-300/60 shrink-0">{wreck.year}</span>
      </div>
      <div className="text-[11px] text-sky-300/50 mb-1">{wreck.location}</div>
      <p className="text-[13px] text-sky-200/90 leading-relaxed">{wreck.detail}</p>
    </div>
  )
}

function QuoteContent({ quote }: { quote: (typeof shipwreckQuotes)[number] }) {
  return (
    <div>
      <p className="text-[13px] text-sky-200/90 leading-relaxed italic">
        &ldquo;{quote.text}&rdquo;
      </p>
      <div className="mt-1.5 text-xs text-sky-300/60">
        — {quote.author},{' '}
        <span className="italic">{quote.source}</span>{' '}
        <span className="text-sky-400/40">({quote.year})</span>
      </div>
    </div>
  )
}
