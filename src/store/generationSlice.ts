import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { Trip, TripRequest } from '../types'
import { api, ApiError } from '../services/api'
import { validateDraft } from '../utils/validation'
import { tripsActions } from './tripsSlice'
import type { RootState } from './index'

export interface GenerationState {
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  lastTripId: string | null
}

const initialState: GenerationState = {
  status: 'idle',
  error: null,
  lastTripId: null,
}

export const generateTrip = createAsyncThunk<
  Trip,
  TripRequest | undefined,
  { state: RootState; rejectValue: string }
>('generation/generateTrip', async (payload, { getState, dispatch, rejectWithValue }) => {
  const request = payload || getState().planner.draft
  const errors = validateDraft(request)
  const firstError = Object.values(errors)[0]
  if (firstError) return rejectWithValue(firstError)

  try {
    const response = await api.generateTrip(request)
    dispatch(tripsActions.upsertTrip(response.trip))
    return response.trip
  } catch (error) {
    if (error instanceof ApiError) return rejectWithValue(error.message)
    return rejectWithValue('Не удалось собрать маршрут. Попробуйте ещё раз.')
  }
})

const generationSlice = createSlice({
  name: 'generation',
  initialState,
  reducers: {
    resetGeneration(state) {
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateTrip.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(generateTrip.fulfilled, (state, action) => {
        state.status = 'success'
        state.lastTripId = action.payload.id
      })
      .addCase(generateTrip.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload || action.error.message || 'Неизвестная ошибка'
      })
  },
})

export const generationActions = generationSlice.actions
export const generationReducer = generationSlice.reducer
