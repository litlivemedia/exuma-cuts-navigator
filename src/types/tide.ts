export interface HiLo {
  time: Date
  height: number
  type: 'H' | 'L'
}

export interface NOAAPrediction {
  t: string
  v: string
  type: 'H' | 'L'
}

export interface NOAAResponse {
  predictions: NOAAPrediction[]
}

export type TideDirection = 'flooding' | 'ebbing' | 'slack'

export interface TideStatus {
  direction: TideDirection
  currentSpeedKnots: number
  heightFt: number
  nextEvent: HiLo
  minutesToNextEvent: number
  isSlackWindow: boolean
}
