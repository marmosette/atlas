export type Pace = 'calm' | 'balanced' | 'active'

export interface TripRequest {
  country: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  interests: string[]
  pace: Pace
  notes?: string
}

export interface NormalizedRequest extends TripRequest {
  days: number
  nights: number
}

export interface CountryOption {
  id: string
  name: string
  flag: string
  region: string
  tagline: string
  scene: string
  palette: [string, string, string]
  fromPrice: number
  cities: number
  bestMonths: number[]
}

export interface CountryCard extends CountryOption {
  description: string
}

export interface CountryInfo {
  id: string
  name: string
  prepositional: string
  flag: string
  region: string
  tagline: string
  description: string
  scene: string
  palette: [string, string, string]
  currency: string
  language: string
  visa: string
  climate: string
}

export interface CityHighlight {
  title: string
  description: string
  type: string
  area: string
}

export interface CityStop {
  id: string
  name: string
  tagline: string
  description: string
  scene: string
  nights: number
  nightsLabel: string
  why: string
  highlights: CityHighlight[]
  hotelId: string
}

export interface Hotel {
  id: string
  cityId: string
  cityName: string
  name: string
  area: string
  rating: number
  reviews: number
  tier: number
  tags: string[]
  description: string
  pricePerNight: number
  nights: number
  rooms: number
  total: number
}

export interface BudgetCategory {
  key: string
  label: string
  amount: number
  percent: number
  color: string
  icon: string
  note: string
}

export interface Budget {
  total: number
  totalLabel: string
  perPerson: number
  perPersonLabel: string
  daily: number
  dailyLabel: string
  currency: string
  categories: BudgetCategory[]
  rooms: number
}

export interface Weather {
  high: number
  low: number
  condition: string
}

export interface DayEvent {
  id: string
  time: string
  title: string
  description: string
  type: string
  icon: string
  duration: string
  cost: number
  location: string
}

export interface DayTransfer {
  from: string
  to: string
  mode: string
}

export interface DayPlan {
  dayNumber: number
  date: string
  dateLabel: string
  weekday: string
  cityId: string
  cityName: string
  title: string
  summary: string
  weather: Weather
  events: DayEvent[]
  dailyBudget: number
  dailyBudgetLabel: string
  transfer: DayTransfer | null
}

export interface Transfer {
  from: string
  to: string
  mode: string
}

export interface TripMeta {
  source: 'atlas' | 'gigachat'
  model: string
  generatedAt: string
  disclaimer: string
  aiNote: string
}

export interface TripStats {
  days: number
  nights: number
  cities: number
  travelers: number
  budget: number
  perPerson: number
  budgetLabel: string
  perPersonLabel: string
  daysLabel: string
  citiesLabel: string
}

export interface TripDates {
  start: string
  end: string
  label: string
  year: number
}

export interface Trip {
  id: string
  createdAt: string
  request: NormalizedRequest
  title: string
  subtitle: string
  summary: string
  aiNote: string
  country: CountryInfo
  dates: TripDates
  stats: TripStats
  cities: CityStop[]
  hotels: Hotel[]
  budget: Budget
  days: DayPlan[]
  transfers: Transfer[]
  tips: string[]
  checklist: {
    documents: string[]
    packing: string[]
  }
  meta: TripMeta
}

export interface GenerateResponse {
  trip: Trip
  meta: {
    source: 'atlas' | 'gigachat'
    model: string
    aiConfigured: boolean
    aiFallback: boolean
    generatedInMs: number
  }
}

export interface CountriesResponse {
  countries: CountryOption[]
  featured: CountryCard[]
}
