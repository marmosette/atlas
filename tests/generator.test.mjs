import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { generatePlan, normalizeRequest } = require('../stubs/api/generator.js')
const { extractJson } = require('../stubs/api/ai.js')

const baseRequest = {
  country: 'georgia',
  startDate: '2027-05-12',
  endDate: '2027-05-19',
  budget: 180000,
  travelers: 2,
  interests: ['Гастрономия', 'Природа'],
  pace: 'balanced',
  notes: '',
}

test('generates a complete trip with an exact budget', () => {
  const trip = generatePlan(baseRequest)
  assert.equal(trip.days.length, 8)
  assert.equal(trip.stats.nights, 7)
  assert.ok(trip.cities.length >= 2)
  assert.equal(trip.hotels.length, trip.cities.length)
  assert.equal(
    trip.budget.categories.reduce((sum, category) => sum + category.amount, 0),
    trip.budget.total
  )
  assert.equal(trip.budget.total, baseRequest.budget)
  assert.ok(trip.days.every((day) => day.events.length >= 4))
  assert.ok(trip.tips.length >= 4)
  assert.ok(trip.checklist.documents.length >= 4)
  assert.equal(trip.meta.source, 'atlas')
})

test('nights are distributed exactly between cities', () => {
  const trip = generatePlan({ ...baseRequest, startDate: '2027-06-01', endDate: '2027-06-11' })
  assert.equal(
    trip.cities.reduce((sum, city) => sum + city.nights, 0),
    trip.stats.nights
  )
  assert.ok(trip.cities.every((city) => city.nights >= 1))
  assert.equal(trip.days.length, 11)
})

test('handles a short two-day trip', () => {
  const trip = generatePlan({
    ...baseRequest,
    startDate: '2027-04-10',
    endDate: '2027-04-11',
    budget: 40000,
    travelers: 1,
  })
  assert.equal(trip.days.length, 2)
  assert.equal(trip.stats.nights, 1)
  assert.equal(trip.cities.length, 1)
  assert.equal(trip.days[0].cityId, trip.days[1].cityId)
})

test('supports the surprise-me direction', () => {
  const trip = generatePlan({ ...baseRequest, country: 'surprise', budget: 90000 })
  assert.ok(trip.country.id)
  assert.ok(trip.title.length > 5)
})

test('applies an AI city plan and hotel selection', () => {
  const base = generatePlan(baseRequest)
  const secondCity = base.cities[1]
  const hotel = base.hotels.find((item) => item.cityId === secondCity.id)
  const trip = generatePlan(baseRequest, {
    country: base.country.id,
    cityPlan: [
      { id: base.cities[0].id, nights: 4, why: 'Так удобнее по датам.' },
      { id: secondCity.id, nights: 3, why: 'Второй город для контраста.' },
    ],
    hotels: { [secondCity.id]: hotel.id },
    title: 'Авторский маршрут',
    source: 'gigachat',
    model: 'GigaChat',
    aiNote: 'Маршрут собран под ваш темп.',
    aiTips: ['Берите наличные на рынки.'],
  })
  assert.equal(trip.title, 'Авторский маршрут')
  assert.equal(trip.cities.length, 2)
  assert.equal(trip.cities[0].nights, 4)
  assert.equal(trip.meta.source, 'gigachat')
  assert.ok(trip.tips.some((tip) => tip.includes('наличные')))
})

test('rejects impossible dates and budgets', () => {
  assert.throws(() => normalizeRequest({ ...baseRequest, endDate: '2027-05-01' }), /позже/)
  assert.throws(() => normalizeRequest({ ...baseRequest, budget: 1000 }), /30 000/)
  assert.throws(() => normalizeRequest({ ...baseRequest, startDate: 'not-a-date' }), /даты/)
})

test('extracts JSON from GigaChat markdown fences', () => {
  const parsed = extractJson('```json\n{"title":"Тест","cities":[]}\n```')
  assert.deepEqual(parsed, { title: 'Тест', cities: [] })
  assert.equal(extractJson('no json here'), null)
})
