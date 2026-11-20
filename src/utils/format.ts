import type { Pace, TripRequest } from '../types'

export const INTERESTS = [
  { id: 'Гастрономия', icon: 'cup' as const },
  { id: 'Архитектура', icon: 'museum' as const },
  { id: 'Природа', icon: 'mountain' as const },
  { id: 'Музеи', icon: 'museum' as const },
  { id: 'Пляжи', icon: 'sun' as const },
  { id: 'История', icon: 'compass' as const },
  { id: 'Активный отдых', icon: 'walk' as const },
  { id: 'Шопинг', icon: 'bag' as const },
]

export const PACE_OPTIONS: { id: Pace; label: string; description: string }[] = [
  { id: 'calm', label: 'Спокойный', description: '2–3 якоря в день' },
  { id: 'balanced', label: 'Баланс', description: 'Город и отдых' },
  { id: 'active', label: 'Активный', description: 'Максимум впечатлений' },
]

export const BUDGET_PRESETS = [80000, 150000, 250000, 400000]

export const formatMoney = (value: number): string =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value))

export const formatMoneyShort = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)} млн`
  if (value >= 1_000) return `${Math.round(value / 1_000)} тыс.`
  return String(Math.round(value))
}

export const plural = (count: number, one: string, few: string, many: string): string => {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

export const daysWord = (count: number) => plural(count, 'день', 'дня', 'дней')
export const nightsWord = (count: number) => plural(count, 'ночь', 'ночи', 'ночей')
export const citiesWord = (count: number) => plural(count, 'город', 'города', 'городов')
export const travelersWord = (count: number) => plural(count, 'путешественник', 'путешественника', 'путешественников')

const MONTHS_NOMINATIVE = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

export const monthName = (monthIndex: number, genitive = false): string =>
  genitive ? MONTHS_GENITIVE[monthIndex] : MONTHS_NOMINATIVE[monthIndex]

export const toLocalIso = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const parseLocalIso = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '')
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? null : date
}

export const addDays = (date: Date, amount: number): Date => {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export const formatDate = (value: string, withYear = false): string => {
  const date = parseLocalIso(value)
  if (!date) return value
  const base = `${date.getDate()} ${monthName(date.getMonth(), true)}`
  return withYear ? `${base} ${date.getFullYear()}` : base
}

export const formatDateRange = (startValue: string, endValue: string): string => {
  const start = parseLocalIso(startValue)
  const end = parseLocalIso(endValue)
  if (!start || !end) return 'Даты не выбраны'
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}–${end.getDate()} ${monthName(end.getMonth(), true)} ${end.getFullYear()}`
  }
  return `${formatDate(startValue)} — ${formatDate(endValue, true)}`
}

export const getDefaultRequest = (): TripRequest => {
  const today = new Date()
  const start = addDays(today, 45)
  const end = addDays(start, 6)
  return {
    country: 'georgia',
    startDate: toLocalIso(start),
    endDate: toLocalIso(end),
    budget: 150000,
    travelers: 2,
    interests: ['Гастрономия', 'Природа', 'Архитектура'],
    pace: 'balanced',
    notes: '',
  }
}

export const getDuration = (startValue: string, endValue: string): number => {
  const start = parseLocalIso(startValue)
  const end = parseLocalIso(endValue)
  if (!start || !end) return 0
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86400000) + 1)
}

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export const timeAgo = (iso: string): string => {
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  if (diff < 60_000) return 'только что'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} мин назад`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} ч назад`
  return formatDate(iso.slice(0, 10), true)
}
