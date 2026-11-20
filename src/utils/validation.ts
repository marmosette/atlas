import type { TripRequest } from '../types'
import { getDuration, getDefaultRequest, parseLocalIso, toLocalIso, addDays } from './format'

export type FieldErrors = Partial<Record<keyof TripRequest, string>>

const MIN_BUDGET = 30_000
const MAX_BUDGET = 5_000_000
const MAX_DAYS = 21

export const validateDraft = (draft: TripRequest): FieldErrors => {
  const errors: FieldErrors = {}
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = parseLocalIso(draft.startDate)
  const end = parseLocalIso(draft.endDate)

  if (!draft.country) errors.country = 'Выберите направление'

  if (!start) {
    errors.startDate = 'Выберите дату отправления'
  } else if (start.getTime() < today.getTime()) {
    errors.startDate = 'Дата уже прошла — выберите будущую'
  }

  if (!end) {
    errors.endDate = 'Выберите дату возвращения'
  } else if (start && end.getTime() <= start.getTime()) {
    errors.endDate = 'Возвращение должно быть позже отправления'
  } else if (start && getDuration(draft.startDate, draft.endDate) > MAX_DAYS) {
    errors.endDate = `Максимум ${MAX_DAYS} дней — выберите даты короче`
  }

  if (!Number.isFinite(draft.budget) || draft.budget < MIN_BUDGET) {
    errors.budget = `Минимум ${new Intl.NumberFormat('ru-RU').format(MIN_BUDGET)} ₽`
  } else if (draft.budget > MAX_BUDGET) {
    errors.budget = 'Для демо-расчёта максимум 5 000 000 ₽'
  }

  if (!Number.isFinite(draft.travelers) || draft.travelers < 1 || draft.travelers > 8) {
    errors.travelers = 'От 1 до 8 путешественников'
  }

  return errors
}

export const getInitialDraft = (): TripRequest => {
  const fallback = getDefaultRequest()
  try {
    const raw = window.localStorage.getItem('atlas.draft.v1')
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as TripRequest
    if (!parsed?.country || !parsed.startDate || !parsed.endDate) return fallback
    const start = parseLocalIso(parsed.startDate)
    if (!start) return fallback
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (start < today) {
      const nextStart = addDays(today, 45)
      return {
        ...fallback,
        ...parsed,
        startDate: toLocalIso(nextStart),
        endDate: toLocalIso(addDays(nextStart, 6)),
      }
    }
    return { ...fallback, ...parsed, notes: parsed.notes || '' }
  } catch {
    return fallback
  }
}
