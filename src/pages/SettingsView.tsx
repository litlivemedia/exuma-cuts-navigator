export function SettingsView({
  onRefresh,
  lastTideFetch,
  lastWindFetch,
  isOnline,
}: {
  onRefresh: () => void
  lastTideFetch: Date | null
  lastWindFetch: Date | null
  isOnline: boolean
}) {
  return (
    <div className="pl-4 pr-6 py-4 pb-24 space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <h3 className="font-semibold text-slate-800">Data Status</h3>
        <div className="text-sm space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Connection</span>
            <span className={isOnline ? 'text-green-700' : 'text-red-700'}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tide data</span>
            <span className="text-slate-700">
              {lastTideFetch ? lastTideFetch.toLocaleTimeString() : 'Not loaded'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Wind data</span>
            <span className="text-slate-700">
              {lastWindFetch ? lastWindFetch.toLocaleTimeString() : 'Not loaded'}
            </span>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="w-full bg-sky-700 text-white text-sm font-medium rounded-lg py-2.5 active:bg-sky-800"
        >
          Refresh Data
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <h3 className="font-semibold text-slate-800">About</h3>
        <div className="text-sm text-slate-600 space-y-2">
          <p>
            <strong>Exuma Cuts Navigator</strong> helps boaters plan safe transits
            through the cuts in the Exuma Cays island chain, Bahamas.
          </p>
          <p>
            Tide predictions are based on NOAA data for Nassau with estimated time
            offsets for each cut. Wind data is from Open-Meteo.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <h3 className="font-semibold text-slate-800">How to Read the Data</h3>
        <div className="text-sm text-slate-600 space-y-2">
          <p>
            <strong>Flooding</strong> = tide rising, current flows west (onto the bank).
          </p>
          <p>
            <strong>Ebbing</strong> = tide falling, current flows east (out to Exuma Sound).
          </p>
          <p>
            <strong>Slack</strong> = ~1 hour window around high/low tide with minimal current.
            Best time to transit.
          </p>
          <p>
            <strong>Wind Opposing Current</strong> = wind blowing against the direction of
            current flow, creating steep confused seas. Avoid transiting cuts when this
            warning is active, especially with wind over 15 knots.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
        <h3 className="font-semibold text-amber-800 text-sm">Disclaimer</h3>
        <p className="text-xs text-amber-700 mt-1">
          This app provides estimates based on NOAA predictions and calculated
          offsets. It is NOT a substitute for local knowledge, current observations,
          or professional navigation advice. Offsets are approximate and conditions
          can vary. Always assess conditions visually before transiting any cut.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
        <h3 className="font-semibold text-slate-800">Offset Data</h3>
        <p className="text-xs text-slate-500">
          Time offsets are relative to Nassau (NOAA station TEC4623). Negative
          means the tide arrives earlier than Nassau; positive means later.
          Offsets compiled from Navionics stations, Explorer Charts references,
          and cruiser reports. Accuracy varies by location.
        </p>
      </div>
    </div>
  )
}
