const { z } = require('zod')

const { COUNTRY_BY_ID } = require('./catalog')
const { formatMoney, plural } = require('./generator')

const AI_TIMEOUT_MS = Number(process.env.GIGACHAT_TIMEOUT_MS || 40000)

const AiPlanSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  subtitle: z.string().min(3).max(160).optional(),
  aiNote: z.string().min(10).max(900).optional(),
  cities: z
    .array(
      z.object({
        id: z.string().min(1),
        nights: z.number().int().min(1).max(21),
        why: z.string().max(320).optional(),
      })
    )
    .min(1)
    .max(6),
  hotels: z.record(z.string()).optional(),
  days: z
    .array(
      z.object({
        date: z.string(),
        theme: z.string().max(120).optional(),
        note: z.string().max(420).optional(),
      })
    )
    .max(21)
    .optional(),
  tips: z.array(z.string().max(260)).max(6).optional(),
})

const isAiEnabled = () =>
  process.env.AI_ENABLED !== 'false' &&
  Boolean(process.env.GIGACHAT_CREDENTIALS || process.env.GIGACHAT_AUTH_KEY)

const getModelName = () => process.env.GIGACHAT_MODEL || 'GigaChat'

const buildPrompt = (baseTrip, request) => {
  const country = baseTrip.country
  const catalogCountry = COUNTRY_BY_ID.get(country.id)
  const cityLines = catalogCountry.cities.map((city) => {
    const hotels = city.hotels
      .map((hotel) => `${hotel.id} (${hotel.name}, ${hotel.tier}★)`)
      .join(', ')
    return `- ${city.id}: ${city.name} — ${city.tagline}. Отели: ${hotels}`
  })

  return `Ты — старший куратор путешествий сервиса «Атлас». Собери осмысленный маршрут по заявке клиента.

Заявка:
- Страна: ${country.name}
- Даты: ${request.startDate} — ${request.endDate} (${baseTrip.stats.days} дней, ${baseTrip.stats.nights} ночей)
- Бюджет: ${formatMoney(request.budget)} ₽ на ${request.travelers} ${plural(request.travelers, 'человека', 'человек', 'человек')}
- Темп: ${request.pace === 'calm' ? 'спокойный' : request.pace === 'active' ? 'активный' : 'сбалансированный'}
- Интересы: ${request.interests.length ? request.interests.join(', ') : 'без особых предпочтений'}
- Пожелания: ${request.notes || 'нет'}

Доступные города и отели (выбирай только эти id):
${cityLines.join('\n')}

Правила:
1. Выбери от 1 до ${Math.min(baseTrip.stats.nights, 4)} городов. Сумма ночей должна равняться ${baseTrip.stats.nights}. В каждом городе минимум 1 ночь.
2. Не включай город, если на него не хватает бюджета или дорога съест больше половины дня.
3. Отель выбирай по бюджету и темпу, id — строго из списка выше.
4. Для каждого дня маршрута (${baseTrip.stats.days} дней, даты от ${request.startDate} до ${request.endDate}) придумай короткую тему дня и одну живую заметку. Не повторяй темы.
5. Пиши по-русски, тепло и конкретно, без штампов «жемчужина» и «незабываемый».
6. aiNote — 2–3 предложения, почему такой маршрут подходит именно этому человеку.
7. tips — до 4 неочевидных советов по стране и сезону.

Верни ТОЛЬКО валидный JSON без markdown и комментариев:
{
  "title": "Грузия: Тбилиси, Казбеги и Кахетия",
  "subtitle": "короткая фраза о поездке",
  "aiNote": "почему маршрут подходит",
  "cities": [{"id": "tbilisi", "nights": 3, "why": "зачем именно этот город"}],
  "hotels": {"tbilisi": "salvo-hotel"},
  "days": [{"date": "2026-05-12", "theme": "Тбилиси: первое знакомство", "note": "что важно сегодня"}],
  "tips": ["совет"]
}`
}

const extractJson = (content) => {
  const text = String(content || '')
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    return JSON.parse(text.slice(start, end + 1))
  } catch {
    return null
  }
}

const withTimeout = (promise, timeoutMs, message) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      }
    )
  })

const requestAiPlan = async (baseTrip, request) => {
  const credentials = process.env.GIGACHAT_CREDENTIALS || process.env.GIGACHAT_AUTH_KEY
  const { GigaChat } = await import('langchain-gigachat')
  const { HumanMessage, SystemMessage } = await import('@langchain/core/messages')
  const https = await import('node:https')

  const model = new GigaChat({
    credentials,
    model: getModelName(),
    temperature: Number(process.env.GIGACHAT_TEMPERATURE || 0.65),
    maxTokens: 4000,
    timeout: 30000,
    httpsAgent: new https.Agent({ rejectUnauthorized: process.env.GIGACHAT_VERIFY_SSL === 'true' }),
    scope: process.env.GIGACHAT_SCOPE || 'GIGACHAT_API_PERS',
  })

  const response = await withTimeout(
    model.invoke([
      new SystemMessage(
        'Ты — опытный travel-дизайнер. Отвечаешь только валидным JSON по заданной схеме, без пояснений и markdown.'
      ),
      new HumanMessage(buildPrompt(baseTrip, request)),
    ]),
    AI_TIMEOUT_MS,
    'GigaChat не ответил вовремя'
  )

  const raw = Array.isArray(response.content)
    ? response.content.map((part) => (typeof part === 'string' ? part : part?.text || '')).join('')
    : response.content
  const parsed = extractJson(raw)
  if (!parsed) throw new Error('GigaChat вернул ответ без корректного JSON')

  const validated = AiPlanSchema.parse(parsed)
  const knownCities = new Set(catalogCountry.cities.map((city) => city.id))
  const knownHotels = new Set(
    catalogCountry.cities.flatMap((city) => city.hotels.map((hotel) => hotel.id))
  )
  const cities = validated.cities.filter((city) => knownCities.has(city.id))
  if (!cities.length) throw new Error('GigaChat не выбрал ни одного города из каталога')

  const hotelMap = {}
  Object.entries(validated.hotels || {}).forEach(([cityId, hotelId]) => {
    if (knownCities.has(cityId) && knownHotels.has(String(hotelId))) {
      hotelMap[cityId] = String(hotelId)
    }
  })

  const dayThemes = {}
  ;(validated.days || []).forEach((day) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(day.date)) {
      dayThemes[day.date] = {
        theme: day.theme || '',
        note: day.note || '',
      }
    }
  })

  return {
    title: validated.title,
    subtitle: validated.subtitle,
    aiNote: validated.aiNote,
    cities,
    hotels: hotelMap,
    dayThemes,
    tips: validated.tips || [],
    model: getModelName(),
  }
}

module.exports = {
  isAiEnabled,
  requestAiPlan,
  getModelName,
  extractJson,
}
