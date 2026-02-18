import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import type { CutStatus, SafetyLevel } from '../../types/cut.ts'
import { format } from 'date-fns'

const EXUMA_CENTER: [number, number] = [24.25, -76.55]
const EXUMA_ZOOM = 9

function createIcon(level: SafetyLevel): L.DivIcon {
  const colors: Record<SafetyLevel, string> = {
    safe: '#16a34a',
    caution: '#d97706',
    hazardous: '#dc2626',
  }
  return L.divIcon({
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `<div style="
      width:24px;height:24px;border-radius:50%;
      background:${colors[level]};
      border:3px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
    "></div>`,
  })
}

function FitBoundsOnce({ statuses }: { statuses: CutStatus[] }) {
  const map = useMap()
  const fitted = useRef(false)

  useEffect(() => {
    if (statuses.length > 0 && !fitted.current) {
      const bounds = L.latLngBounds(
        statuses.map((s) => [s.cut.lat, s.cut.lon] as [number, number])
      )
      map.fitBounds(bounds, { padding: [40, 40] })
      fitted.current = true
    }
  }, [map, statuses])

  return null
}

export function CutMap({
  statuses,
  onSelect,
}: {
  statuses: CutStatus[]
  onSelect: (id: string) => void
}) {
  return (
    <MapContainer
      center={EXUMA_CENTER}
      zoom={EXUMA_ZOOM}
      className="h-full w-full"
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBoundsOnce statuses={statuses} />
      {statuses.map((s) => (
        <Marker
          key={s.cut.id}
          position={[s.cut.lat, s.cut.lon]}
          icon={createIcon(s.safetyLevel)}
          eventHandlers={{ click: () => onSelect(s.cut.id) }}
        >
          <Popup>
            <div style={{ fontSize: '13px', minWidth: '160px', lineHeight: '1.5' }}>
              <strong>{s.cut.name}</strong>
              <div style={{ marginTop: '4px' }}>
                {s.tideDirection === 'slack' ? (
                  <span style={{ color: '#15803d', fontWeight: 600 }}>Slack Water</span>
                ) : (
                  <span>
                    {s.tideDirection === 'flooding' ? 'Flooding' : 'Ebbing'}{' '}
                    {s.currentSpeedKnots.toFixed(1)} kts
                  </span>
                )}
              </div>
              <div style={{ color: '#64748b' }}>
                {s.nextEventType === 'H' ? 'High' : 'Low'}{' '}
                at {format(s.nextEventTime, 'h:mm a')}
              </div>
              <div style={{ color: '#64748b' }}>
                Wind: {s.windDirectionCardinal} {Math.round(s.windSpeedKnots)} kts
              </div>
              {s.isWindAgainstCurrent && (
                <div style={{ color: '#dc2626', fontWeight: 700, marginTop: '4px' }}>
                  Wind opposing current
                </div>
              )}
              <button
                onClick={() => onSelect(s.cut.id)}
                style={{ marginTop: '8px', color: '#0369a1', fontSize: '12px', fontWeight: 500, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                View details &rarr;
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
