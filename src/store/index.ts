import { configureStore } from '@reduxjs/toolkit'

import { generationReducer } from './generationSlice'
import { plannerReducer } from './plannerSlice'
import { tripsReducer } from './tripsSlice'
import { saveDraft, saveTrips } from '../services/storage'

export const store = configureStore({
  reducer: {
    planner: plannerReducer,
    trips: tripsReducer,
    generation: generationReducer,
  },
})

let saveTimer: number | undefined
let previousTrips = store.getState().trips.items
let previousDraft = store.getState().planner.draft

store.subscribe(() => {
  const state = store.getState()
  const tripsChanged = state.trips.items !== previousTrips
  const draftChanged = state.planner.draft !== previousDraft
  if (!tripsChanged && !draftChanged) return

  previousTrips = state.trips.items
  previousDraft = state.planner.draft

  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    saveTrips(store.getState().trips.items)
    saveDraft(store.getState().planner.draft)
  }, 350)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
