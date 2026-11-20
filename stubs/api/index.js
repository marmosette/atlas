const express = require('express')

const {
  COUNTRIES,
  getCountryOptions,
  getFeaturedCountries,
} = require('./catalog')
const { generatePlan, normalizeRequest } = require('./generator')
const { isAiEnabled, requestAiPlan, getModelName } = require('./ai')

const router = express.Router()

const trips = new Map()
const MAX_TRIPS = 120
const MIN_GENERATION_MS = Number(process.env.MIN_GENERATION_MS || 1100)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const rememberTrip = (trip) => {
  trips.set(trip.id, trip)
  if (trips.size > MAX_TRIPS) {
    const oldest = trips.keys().next().value
    trips.delete(oldest)
  }
}

const publicCountry = (country) => ({
  id: country.id,
  name: country.name,
  flag: country.flag,
  region: country.region,
  tagline: country.tagline,
  description: country.description,
  scene: country.scene,
  palette: country.palette,
  fromPrice: country.fromPrice,
  cities: country.cities.length,
  bestMonths: country.bestMonths,
})

router.use((req, res, next) => {
  res.type('application/json')
  next()
})

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: 'atlas-stubs',
    aiConfigured: isAiEnabled(),
    model: getModelName(),
    countries: COUNTRIES.length,
    cachedTrips: trips.size,
    time: new Date().toISOString(),
  })
})

router.get('/countries', (req, res) => {
  res.json({
    countries: getCountryOptions(),
    featured: getFeaturedCountries().map(publicCountry),
  })
})

router.get('/countries/:id', (req, res) => {
  const country = COUNTRIES.find((item) => item.id === req.params.id)
  if (!country) {
    res.status(404).json({ error: 'Направление не найдено' })
    return
  }
  res.json({
    country: publicCountry(country),
    cities: country.cities.map((city) => ({
      id: city.id,
      name: city.name,
      tagline: city.tagline,
      scene: city.scene,
      highlights: city.highlights.slice(0, 4).map((item) => item.title),
      hotels: city.hotels.map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        rating: hotel.rating,
        tier: hotel.tier,
      })),
    })),
  })
})

router.post('/trips/generate', async (req, res) => {
  const startedAt = Date.now()
  let request
  try {
    request = normalizeRequest(req.body || {})
  } catch (error) {
    res.status(400).json({ error: error.message || 'Проверьте параметры поездки' })
    return
  }

  let trip = generatePlan(request)
  let source = 'atlas'
  let aiError = null
  let model = 'Atlas Engine 1.0'

  if (isAiEnabled()) {
    try {
      const ai = await requestAiPlan(trip, request)
      trip = generatePlan(request, {
        country: trip.country.id,
        cityPlan: ai.cities,
        hotels: ai.hotels,
        dayThemes: ai.dayThemes,
        title: ai.title,
        subtitle: ai.subtitle,
        aiNote: ai.aiNote,
        aiTips: ai.tips,
        source: 'gigachat',
        model: ai.model,
      })
      source = 'gigachat'
      model = ai.model
    } catch (error) {
      aiError = error.message || 'GigaChat недоступен'
      console.warn('[atlas] GigaChat fallback:', aiError)
    }
  }

  const elapsed = Date.now() - startedAt
  if (elapsed < MIN_GENERATION_MS) {
    await delay(MIN_GENERATION_MS - elapsed)
  }

  rememberTrip(trip)
  res.json({
    trip,
    meta: {
      source,
      model,
      aiConfigured: isAiEnabled(),
      aiFallback: Boolean(aiError),
      generatedInMs: Date.now() - startedAt,
    },
  })
})

router.get('/trips/:id', (req, res) => {
  const trip = trips.get(req.params.id)
  if (!trip) {
    res.status(404).json({ error: 'Маршрут не найден или устарел' })
    return
  }
  res.json({ trip })
})

router.use((req, res) => {
  res.status(404).json({ error: 'Метод API не найден' })
})

router.use((error, req, res, next) => {
  console.error('[atlas] API error:', error)
  if (res.headersSent) {
    next(error)
    return
  }
  res.status(500).json({ error: 'Не удалось собрать маршрут. Попробуйте ещё раз.' })
})

module.exports = router
