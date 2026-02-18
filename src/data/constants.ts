export const NASSAU_STATION_ID = 'TEC4623'

export const NOAA_API_BASE =
  'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter'

export const OPEN_METEO_API_BASE = 'https://api.open-meteo.com/v1/forecast'

// Central Exuma point for wind data (Waderick Wells)
export const WIND_FETCH_LAT = 24.385
export const WIND_FETCH_LON = -76.627

// Slack water window: +/- minutes from high/low
export const SLACK_WINDOW_MINUTES = 30

// Wind-vs-current thresholds
export const WIND_OPPOSING_MIN_KNOTS = 10
export const WIND_HAZARDOUS_KNOTS = 15
export const WIND_CAUTION_STRONG_KNOTS = 20
export const GUST_HAZARDOUS_KNOTS = 20
export const CURRENT_HAZARDOUS_KNOTS = 2.0
export const CURRENT_CAUTION_KNOTS = 2.5

// Cache freshness (milliseconds)
export const TIDE_CACHE_MAX_AGE = 6 * 60 * 60 * 1000 // 6 hours
export const WIND_CACHE_MAX_AGE = 3 * 60 * 60 * 1000 // 3 hours
export const MARINE_CACHE_MAX_AGE = 3 * 60 * 60 * 1000 // 3 hours
