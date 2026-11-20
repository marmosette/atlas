import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Pace, TripRequest } from '../types'
import { getInitialDraft } from '../utils/validation'

export interface PlannerState {
  draft: TripRequest
}

const initialState: PlannerState = {
  draft: getInitialDraft(),
}

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    updateDraft(state, action: PayloadAction<Partial<TripRequest>>) {
      state.draft = { ...state.draft, ...action.payload }
    },
    setCountry(state, action: PayloadAction<string>) {
      state.draft.country = action.payload
    },
    setDates(state, action: PayloadAction<{ startDate: string; endDate: string }>) {
      state.draft.startDate = action.payload.startDate
      state.draft.endDate = action.payload.endDate
    },
    setBudget(state, action: PayloadAction<number>) {
      state.draft.budget = action.payload
    },
    setTravelers(state, action: PayloadAction<number>) {
      state.draft.travelers = action.payload
    },
    setPace(state, action: PayloadAction<Pace>) {
      state.draft.pace = action.payload
    },
    toggleInterest(state, action: PayloadAction<string>) {
      const interest = action.payload
      const exists = state.draft.interests.includes(interest)
      if (exists) {
        state.draft.interests = state.draft.interests.filter((item) => item !== interest)
        return
      }
      if (state.draft.interests.length >= 5) return
      state.draft.interests = [...state.draft.interests, interest]
    },
    setNotes(state, action: PayloadAction<string>) {
      state.draft.notes = action.payload.slice(0, 500)
    },
    resetDraft(state) {
      state.draft = getInitialDraft()
    },
  },
})

export const plannerActions = plannerSlice.actions
export const plannerReducer = plannerSlice.reducer
