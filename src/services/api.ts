import type { CountriesResponse, GenerateResponse, Trip, TripRequest } from '../types'

const API_BASE = '/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const request = async <T>(path: string, init?: RequestInit, timeoutMs = 90_000): Promise<T> => {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    })
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      throw new ApiError(payload?.error || 'Не удалось выполнить запрос', response.status)
    }
    return payload as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Сборка маршрута заняла слишком много времени. Попробуйте ещё раз.', 408)
    }
    throw new ApiError('Сервер недоступен. Проверьте соединение и попробуйте снова.', 503)
  } finally {
    window.clearTimeout(timer)
  }
}

export const api = {
  getCountries: () => request<CountriesResponse>('/countries', undefined, 15_000),
  generateTrip: (body: TripRequest) =>
    request<GenerateResponse>(
      '/trips/generate',
      { method: 'POST', body: JSON.stringify(body) },
      95_000
    ),
  getTrip: (id: string) => request<{ trip: Trip }>(`/trips/${encodeURIComponent(id)}`, undefined, 15_000),
}
