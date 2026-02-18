export interface WindHourly {
  time: Date
  speedKnots: number
  directionDeg: number
  gustKnots: number
}

export interface OpenMeteoResponse {
  hourly: {
    time: string[]
    wind_speed_10m: number[]
    wind_direction_10m: number[]
    wind_gusts_10m: number[]
  }
}

export interface WindStatus {
  speedKnots: number
  gustKnots: number
  directionDeg: number
  directionCardinal: string
}
