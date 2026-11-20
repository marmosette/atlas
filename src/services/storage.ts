import type { Trip, TripRequest } from '../types'

const TRIPS_KEY = 'atlas.trips.v1'
const DRAFT_KEY = 'atlas.draft.v1'
const MAX_LOCAL_TRIPS = 24

const isTrip = (value: unknown): value is Trip => {
  if (!value || typeof value !== 'object') return false
  const trip = value as Trip
  return (
    typeof trip.id === 'string' &&
    typeof trip.title === 'string' &&
    Array.isArray(trip.days) &&
    Boolean(trip.budget) &&
    Boolean(trip.country)
  )
}

export const loadTrips = (): Trip[] => {
  try {
    const raw = window.localStorage.getItem(TRIPS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isTrip).slice(0, MAX_LOCAL_TRIPS)
  } catch {
    return []
  }
}

export const saveTrips = (trips: Trip[]): void => {
  try {
    window.localStorage.setItem(TRIPS_KEY, JSON.stringify(trips.slice(0, MAX_LOCAL_TRIPS)))
  } catch {
    // localStorage может быть переполнен или недоступен — приложение продолжает работать.
  }
}

export const loadDraft = (): TripRequest | null => {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<TripRequest>
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.country || !parsed.startDate || !parsed.endDate) return null
    return parsed as TripRequest
  } catch {
    return null
  }
}

export const saveDraft = (draft: TripRequest): void => {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // no-op
  }
}
