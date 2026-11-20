import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Trip } from '../types'
import { loadTrips } from '../services/storage'

export interface TripsState {
  items: Trip[]
}

const initialState: TripsState = {
  items: typeof window === 'undefined' ? [] : loadTrips(),
}

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    upsertTrip(state, action: PayloadAction<Trip>) {
      const trip = action.payload
      state.items = [trip, ...state.items.filter((item) => item.id !== trip.id)].slice(0, 24)
    },
    removeTrip(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearTrips(state) {
      state.items = []
    },
  },
})

export const tripsActions = tripsSlice.actions
export const tripsReducer = tripsSlice.reducer
