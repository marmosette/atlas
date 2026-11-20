const crypto = require('node:crypto')

const { COUNTRIES, findCountry } = require('./catalog')

const MS_DAY = 24 * 60 * 60 * 1000

const WEEKDAYS = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
const MONTHS = [
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

const CLIMATE_TEMPS = {
  temperate: [6, 7, 10, 14, 18, 22, 24, 23, 19, 14, 9, 6],
  continental: [-6, -5, 0, 8, 16, 21, 23, 21, 15, 8, 1, -4],
  mediterranean: [12, 13, 16, 19, 23, 28, 31, 31, 27, 22, 17, 13],
  subtropical: [7, 8, 12, 17, 21, 25, 28, 28, 24, 18, 12, 8],
  tropical: [28, 29, 30, 31, 30, 29, 29, 29, 29, 29, 28, 28],
  desert: [19, 21, 25, 30, 35, 38, 40, 40, 36, 30, 24, 20],
  nordic: [0, 0, 2, 5, 10, 14, 16, 14, 10, 6, 2, 0],
}

const CONDITIONS = {
  tropical: ['влажно, короткий ливень', 'солнечно', 'переменная облачность', 'солнечно'],
  desert: ['ясно', 'солнечно', 'ясно', 'лёгкая дымка'],
  mediterranean: ['солнечно', 'ясно', 'переменная облачность', 'солнечно'],
  subtropical: ['солнечно', 'переменная облачность', 'ясно', 'возможен дождь'],
  temperate: ['переменная облачность', 'солнечно', 'возможен дождь', 'ясно'],
  continental: ['ясно', 'переменная облачность', 'солнечно', 'возможен дождь'],
  nordic: ['облачно', 'возможен дождь', 'переменная облачность', 'ясно'],
}

const EVENT_ICONS = {
  arrival: 'plane',
  departure: 'plane',
  transfer: 'route',
  hotel: 'bed',
  walk: 'walk',
  culture: 'museum',
  museum: 'museum',
  nature: 'mountain',
  view: 'camera',
  beach: 'sun',
  food: 'cup',
  shop: 'bag',
  relax: 'spa',
  free: 'sparkle',
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const roundTo = (value, step = 100) => Math.round(value / step) * step

const plural = (count, one, few, many) => {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

const parseDate = (value) => {
  if (value instanceof Date) return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()))
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ''))
  if (!match) return null
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
  return Number.isNaN(date.getTime()) ? null : date
}

const toIso = (date) => date.toISOString().slice(0, 10)

const addDays = (date, amount) => new Date(date.getTime() + amount * MS_DAY)

const diffDays = (start, end) => Math.round((end.getTime() - start.getTime()) / MS_DAY)

const formatHuman = (date, withYear = false) => {
  const base = `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`
  return withYear ? `${base} ${date.getUTCFullYear()}` : base
}

const formatRange = (start, end) => {
  if (start.getUTCMonth() === end.getUTCMonth()) {
    return `${start.getUTCDate()}–${formatHuman(end, true)}`
  }
  return `${formatHuman(start)} — ${formatHuman(end, true)}`
}

const formatMoney = (value) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value))

const joinRu = (items) => {
  if (items.length <= 1) return items[0] || ''
  if (items.length === 2) return `${items[0]} и ${items[1]}`
  return `${items.slice(0, -1).join(', ')} и ${items[items.length - 1]}`
}

const hashSeed = (value) => {
  const text = String(value)
  let hash = 0
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) | 0
  }
  return Math.abs(hash)
}

const resolveCountry = (request) => {
  if (request.country && request.country !== 'surprise') {
    return findCountry(request.country) || COUNTRIES[0]
  }
  const start = parseDate(request.startDate) || new Date()
  const month = start.getUTCMonth() + 1
  const budget = Number(request.budget) || 100000
  const affordable = COUNTRIES.filter((item) => item.fromPrice <= budget * 1.15)
  const pool = affordable.length ? affordable : COUNTRIES
  const sorted = [...pool].sort((left, right) => {
    const leftSeason = left.bestMonths.includes(month) ? 0 : 1
    const rightSeason = right.bestMonths.includes(month) ? 0 : 1
    if (leftSeason !== rightSeason) return leftSeason - rightSeason
    return left.fromPrice - right.fromPrice
  })
  const seed = hashSeed(`${request.budget}-${request.startDate}-${request.travelers}`)
  const shortlist = sorted.slice(0, Math.min(5, sorted.length))
  return shortlist[seed % shortlist.length]
}

const pickCities = (country, request, nights) => {
  const pace = request.pace || 'balanced'
  let count = Math.ceil(nights / 2.7)
  if (pace === 'calm') count -= 1
  if (pace === 'active') count += 1
  count = clamp(count, 1, country.cities.length)
  count = Math.min(count, nights)
  return country.cities.slice(0, count)
}

const allocateNights = (cities, totalNights) => {
  if (cities.length === 1) return [totalNights]
  const weights = cities.map((city) => city.nights || 2)
  const weightSum = weights.reduce((sum, value) => sum + value, 0)
  const extra = Math.max(totalNights - cities.length, 0)
  const raw = weights.map((weight) => (extra * weight) / weightSum)
  const result = raw.map((value) => 1 + Math.floor(value))
  let left = totalNights - result.reduce((sum, value) => sum + value, 0)
  const fractions = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((leftItem, rightItem) => rightItem.fraction - leftItem.fraction)
  let cursor = 0
  while (left > 0) {
    result[fractions[cursor % fractions.length].index] += 1
    left -= 1
    cursor += 1
  }
  return result
}

const normalizeRequest = (input = {}) => {
  const start = parseDate(input.startDate)
  const end = parseDate(input.endDate)
  if (!start || !end) throw new Error('Укажите корректные даты поездки')
  if (end.getTime() <= start.getTime()) throw new Error('Дата возвращения должна быть позже даты отправления')
  const days = diffDays(start, end) + 1
  if (days < 2) throw new Error('Поездка должна длиться хотя бы два дня')
  if (days > 21) throw new Error('Максимальная длительность поездки — 21 день')

  const budget = Math.round(Number(input.budget))
  if (!Number.isFinite(budget) || budget < 30000) throw new Error('Бюджет должен быть не меньше 30 000 ₽')
  if (budget > 5000000) throw new Error('Бюджет слишком большой для демо-расчёта')

  const travelers = clamp(Math.round(Number(input.travelers) || 1), 1, 8)
  const interests = Array.isArray(input.interests)
    ? input.interests.filter((item) => typeof item === 'string').slice(0, 8)
    : []
  const pace = ['calm', 'balanced', 'active'].includes(input.pace) ? input.pace : 'balanced'
  const notes = typeof input.notes === 'string' ? input.notes.trim().slice(0, 500) : ''

  return {
    country: typeof input.country === 'string' ? input.country.slice(0, 80) : 'surprise',
    startDate: toIso(start),
    endDate: toIso(end),
    budget,
    travelers,
    interests,
    pace,
    notes,
    days,
    nights: days - 1,
  }
}

const getWeather = (country, city, date) => {
  const monthIndex = date.getUTCMonth()
  const temps = CLIMATE_TEMPS[country.climate] || CLIMATE_TEMPS.temperate
  let base = temps[monthIndex]
  if (city.scene === 'mountains') base -= 4
  if (city.scene === 'coast' || city.scene === 'tropical') base += 2
  const variance = (date.getUTCDate() % 3) - 1
  const high = Math.round(base + 2 + variance)
  const low = Math.round(base - 4 + variance)
  const list = CONDITIONS[country.climate] || CONDITIONS.temperate
  return {
    high,
    low,
    condition: list[date.getUTCDate() % list.length],
  }
}

const pickHotel = (city, nightlyAllowance, preferredId) => {
  if (preferredId) {
    const preferred = city.hotels.find(
      (item) => item.id === preferredId || item.name === preferredId
    )
    if (preferred) return preferred
  }
  const sorted = [...city.hotels].sort((left, right) => left.basePrice - right.basePrice)
  const withinBudget = sorted.filter((item) => item.basePrice <= nightlyAllowance * 1.6)
  if (withinBudget.length) return withinBudget[withinBudget.length - 1]
  return sorted[0]
}

const buildCities = (request, country, cityPlan, aiHotels) => {
  const rooms = Math.ceil(request.travelers / 2)
  const nightlyAllowance = (request.budget * 0.34) / request.nights / rooms
  const hotels = []
  const cities = cityPlan.map((item) => {
    const { city, nights, why } = item
    const hotel = pickHotel(city, nightlyAllowance, aiHotels[city.id])
    let pricePerNight = roundTo(nightlyAllowance * 0.95, 100)
    pricePerNight = clamp(pricePerNight, Math.round(hotel.basePrice * 0.7), Math.round(hotel.basePrice * 1.4))
    pricePerNight = clamp(pricePerNight, 2200, 90000)
    const total = pricePerNight * nights * rooms
    const record = {
      id: `${city.id}-${hotel.id}`,
      cityId: city.id,
      cityName: city.name,
      name: hotel.name,
      area: hotel.area,
      rating: hotel.rating,
      reviews: hotel.reviews,
      tier: hotel.tier,
      tags: hotel.tags,
      description: hotel.description,
      pricePerNight,
      nights,
      rooms,
      total,
    }
    hotels.push(record)
    return {
      id: city.id,
      name: city.name,
      tagline: city.tagline,
      description: city.description,
      scene: city.scene,
      nights,
      nightsLabel: `${nights} ${plural(nights, 'ночь', 'ночи', 'ночей')}`,
      why: why || city.tagline,
      highlights: city.highlights.slice(0, 4).map(({ title, description, type, area }) => ({
        title,
        description,
        type,
        area,
      })),
      hotelId: record.id,
      city,
    }
  })

  return { cities, hotels }
}

const buildBudget = (request, hotels) => {
  const rooms = Math.ceil(request.travelers / 2)
  let accommodation = hotels.reduce((sum, hotel) => sum + hotel.total, 0)
  const cap = request.budget * 0.55

  if (accommodation > cap) {
    const scale = cap / accommodation
    hotels.forEach((hotel) => {
      hotel.pricePerNight = roundTo(hotel.pricePerNight * scale, 100)
      hotel.total = hotel.pricePerNight * hotel.nights * hotel.rooms
    })
    accommodation = hotels.reduce((sum, hotel) => sum + hotel.total, 0)
  }

  const remaining = request.budget - accommodation
  const food = roundTo(remaining * 0.36)
  const transport = roundTo(remaining * 0.31)
  const experiences = roundTo(remaining * 0.19)
  const shopping = roundTo(remaining * 0.08)
  const reserve = Math.max(remaining - food - transport - experiences - shopping, 0)
  const raw = [
    { key: 'stay', label: 'Проживание', amount: accommodation, color: '#C96F4A', icon: 'bed', note: `${hotels.length} ${plural(hotels.length, 'отель', 'отеля', 'отелей')} · ${hotels.reduce((sum, hotel) => sum + hotel.rooms, 0)} ${plural(hotels.reduce((sum, hotel) => sum + hotel.rooms, 0), 'номер', 'номера', 'номеров')}` },
    { key: 'food', label: 'Питание', amount: food, color: '#D9A441', icon: 'cup', note: 'Завтраки, кафе и ужины' },
    { key: 'transport', label: 'Дорога', amount: transport, color: '#3F6E63', icon: 'route', note: `Перелёт и переезды · ${request.travelers} ${plural(request.travelers, 'человек', 'человека', 'человек')}` },
    { key: 'experiences', label: 'Впечатления', amount: experiences, color: '#7C8F6D', icon: 'ticket', note: 'Музеи, экскурсии и входные билеты' },
    { key: 'shopping', label: 'Сувениры', amount: shopping, color: '#B98A6A', icon: 'bag', note: 'Подарки и небольшие покупки' },
    { key: 'reserve', label: 'Резерв', amount: reserve, color: '#C9C0B2', icon: 'wallet', note: 'На непредвиденные расходы' },
  ].filter((item) => item.amount > 0)

  const total = raw.reduce((sum, item) => sum + item.amount, 0)
  const categories = raw.map((item) => ({
    ...item,
    percent: Math.round((item.amount / total) * 1000) / 10,
  }))

  return {
    total,
    totalLabel: `${formatMoney(total)} ₽`,
    perPerson: Math.round(total / request.travelers),
    perPersonLabel: `${formatMoney(total / request.travelers)} ₽ / чел.`,
    daily: Math.round(total / request.days),
    dailyLabel: `${formatMoney(total / request.days)} ₽ / день`,
    currency: '₽',
    categories,
    rooms,
  }
}

const event = (time, title, description, type, options = {}) => ({
  id: `${time}-${title}`.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-'),
  time,
  title,
  description,
  type,
  icon: EVENT_ICONS[type] || EVENT_ICONS.free,
  duration: options.duration || '',
  cost: options.cost || 0,
  location: options.location || '',
})

const pickHighlight = (city, used, wantedTypes) => {
  const available = city.highlights.filter((item) => !used.has(item.title))
  const pool = available.length ? available : city.highlights
  const preferred = pool.find((item) => wantedTypes.includes(item.type))
  const chosen = preferred || pool[0]
  used.add(chosen.title)
  return chosen
}

const buildDays = (request, country, cities, hotels, themes = {}) => {
  const start = parseDate(request.startDate)
  const dayCity = []
  let cursor = 0
  let remaining = cities[0].nights
  for (let index = 0; index < request.days; index += 1) {
    if (index > 0 && remaining <= 0 && cursor < cities.length - 1) {
      cursor += 1
      remaining = cities[cursor].nights
    }
    dayCity.push(cursor)
    if (index < request.days - 1) remaining -= 1
  }
  // Последний день всегда в последнем городе маршрута.
  dayCity[request.days - 1] = cities.length - 1

  const used = new Map(cities.map((city) => [city.name, new Set()]))
  const dishes = country.dishes
  const days = []
  let dishIndex = 0

  for (let index = 0; index < request.days; index += 1) {
    const date = addDays(start, index)
    const cityStop = cities[dayCity[index]]
    const city = cityStop.city
    const hotel = hotels.find((item) => item.id === cityStop.hotelId) || hotels[0]
    const usedSet = used.get(city.name)
    const isFirst = index === 0
    const isLast = index === request.days - 1
    const previousCity = index > 0 ? cities[dayCity[index - 1]] : null
    const isTransfer = Boolean(previousCity && previousCity.id !== cityStop.id)
    const weather = getWeather(country, city, date)
    const themeInfo = themes[toIso(date)] || {}
    const events = []

    const breakfastDish = dishes[dishIndex % dishes.length]
    const lunchDish = dishes[(dishIndex + 1) % dishes.length]
    const dinnerDish = dishes[(dishIndex + 2) % dishes.length]
    dishIndex += 1
    const hasBreakfast = hotel.tags.includes('завтрак')

    if (isFirst) {
      events.push(
        event(
          '12:10',
          `Прибытие в ${city.name}`,
          isTransfer
            ? `Переезд из предыдущего города и трансфер до отеля «${hotel.name}».`
            : `Прилёт, паспортный контроль и трансфер до отеля «${hotel.name}».`,
          'arrival',
          { duration: '1,5 ч', location: city.name }
        ),
        event(
          '14:00',
          'Заселение и отдых',
          `Оставить вещи в «${hotel.name}», выпить кофе и немного прийти в себя после дороги.`,
          'hotel',
          { duration: '1,5 ч', location: hotel.area }
        )
      )
    } else if (isTransfer) {
      const mode = country.transferModes[(index + city.name.length) % country.transferModes.length]
      const duration = mode === 'самолёт' ? '2 ч' : mode === 'поезд' ? '3,5 ч' : '2,5 ч'
      events.push(
        event(
          '08:30',
          'Завтрак и выезд',
          hasBreakfast
            ? `Плотный завтрак в «${hotel.name}», сборы и выезд из отеля.`
            : `Кофе и выпечка по дороге, сборы и выезд из отеля.`,
          'food',
          { duration: '1 ч', cost: hasBreakfast ? 0 : 900, location: hotel.area }
        ),
        event(
          '09:30',
          `${mode[0].toUpperCase() + mode.slice(1)}: ${previousCity.name} → ${city.name}`,
          `Переезд между городами. Дорога занимает около ${duration}, по пути — короткая остановка на кофе.`,
          'transfer',
          { duration, cost: mode === 'самолёт' ? 3500 : 1200, location: `${previousCity.name} — ${city.name}` }
        ),
        event(
          '13:30',
          `Отель «${hotel.name}»`,
          `Заселение, душ и короткая прогулка по окрестностям.`,
          'hotel',
          { duration: '1 ч', location: hotel.area }
        )
      )
    } else {
      events.push(
        event(
          '09:00',
          'Завтрак',
          hasBreakfast
            ? `Завтрак в «${hotel.name}»: местные сыры, выпечка и кофе.`
            : `Завтрак в городе: ${breakfastDish.name.toLowerCase()} и кофе.`,
          'food',
          { duration: '1 ч', cost: hasBreakfast ? 0 : 900, location: hotel.area }
        )
      )
    }

    const activitySlots = isFirst
      ? [{ time: '16:30' }, { time: '19:30' }]
      : isLast
        ? [{ time: '10:30' }, { time: '13:30' }]
        : isTransfer
          ? [{ time: '15:30' }, { time: '18:30' }]
          : [{ time: '10:30' }, { time: '14:30' }, { time: '18:00' }]

    activitySlots.forEach((slot, slotIndex) => {
      const wanted =
        slotIndex === 0
          ? ['walk', 'view', 'culture']
          : slotIndex === 1 && activitySlots.length > 2
            ? ['culture', 'nature', 'food']
            : slotIndex === 1
              ? ['view', 'walk', 'culture']
              : ['view', 'walk', 'relax']
      const highlight = pickHighlight(city, usedSet, wanted)
      events.push(
        event(slot.time, highlight.title, highlight.description, highlight.type, {
          duration: highlight.duration,
          cost: highlight.cost,
          location: highlight.area,
        })
      )
      if (slotIndex === 0) {
        events.push(
          event(
            '13:00',
            `Обед: ${lunchDish.name.toLowerCase()}`,
            `${lunchDish.description} Ищем место без туристического меню — обычно на одну улицу вглубь.`,
            'food',
            { duration: '1,5 ч', cost: 1400, location: city.name }
          )
        )
      }
    })

    if (isLast) {
      events.push(
        event('12:30', 'Выезд из отеля', 'Собрать вещи, оставить багаж на ресепшн и погулять последний час.', 'hotel', { duration: '30 мин', location: hotel.area }),
        event('15:30', 'Трансфер в аэропорт', `Забрать багаж и выехать с запасом времени.`, 'departure', { duration: '1,5 ч', location: city.name })
      )
    } else {
      events.push(
        event(
          '20:30',
          `Ужин: ${dinnerDish.name.toLowerCase()}`,
          `${dinnerDish.description} Бокал местного вина или чая — и можно возвращаться в отель.`,
          'food',
          { duration: '2 ч', cost: 2200, location: hotel.area }
        )
      )
    }

    events.sort((left, right) => left.time.localeCompare(right.time))

    const title =
      themeInfo.theme ||
      (isFirst
        ? `${city.name}: первое знакомство`
        : isTransfer
          ? `Переезд: ${previousCity.name} → ${city.name}`
          : isLast
            ? `${city.name}: последний день`
            : `${city.name}: главное без спешки`)

    const highlights = events.filter((item) => !['food', 'hotel', 'transfer', 'arrival', 'departure'].includes(item.type))
    const summary =
      themeInfo.note ||
      (highlights.length
        ? `${highlights[0].title}, ${highlights[1]?.title || 'прогулка по городу'} — и время на кофе.`
        : `Спокойный день: дорога, заселение и первая прогулка.`)

    const activityCosts = events.reduce((sum, item) => sum + (item.cost || 0), 0)
    days.push({
      dayNumber: index + 1,
      date: toIso(date),
      dateLabel: formatHuman(date),
      weekday: WEEKDAYS[date.getUTCDay()],
      cityId: cityStop.id,
      cityName: cityStop.name,
      title,
      summary,
      weather,
      events,
      dailyBudget: activityCosts,
      dailyBudgetLabel: `≈ ${formatMoney(activityCosts)} ₽ на человека`,
      transfer: isTransfer
        ? {
            from: previousCity.name,
            to: cityStop.name,
            mode: country.transferModes[(index + city.name.length) % country.transferModes.length],
          }
        : null,
    })
  }

  return days
}

const buildTips = (request, country, aiTips = []) => {
  const tips = [...aiTips.map((tip) => String(tip).trim()).filter(Boolean).slice(0, 4)]
  tips.push(...country.tips)

  if (request.pace === 'calm') {
    tips.push('Оставьте один день без брони и плана: лучшее в поездке часто случается спонтанно.')
  } else if (request.pace === 'active') {
    tips.push('Начинайте день в 8:00 — до открытия музеев и толп успеете сделать в два раза больше.')
  } else {
    tips.push('Планируйте не больше трёх «якорей» в день, остальное оставляйте на месте.')
  }

  if (request.budget / request.travelers < country.fromPrice) {
    tips.push('Бюджет ниже средней стоимости направления: часть ужинов лучше заменить на рынки и локальные столовые.')
  }

  tips.push('Скачайте офлайн-карты и сохраните адреса отелей: в поездке это экономит нервы и батарею.')
  tips.push('Проверьте прогноз за пару дней и оставьте один свободный слот на случай дождя.')

  if (request.interests.includes('Гастрономия')) {
    tips.push(`Запишитесь на рынок или кулинарный мастер-класс: в ${country.prepositional} это лучший способ понять кухню.`)
  }

  return [...new Set(tips)].slice(0, 7)
}

const buildChecklist = (request, country, start) => {
  const month = start.getUTCMonth() + 1
  const summer = month >= 6 && month <= 8
  const winter = month === 12 || month <= 2
  const packing = ['Удобная обувь для прогулок', 'Пауэрбанк и переходники', 'Аптечка с личными лекарствами', 'Копии документов в облаке']

  if (country.climate === 'tropical') {
    packing.push('Лёгкая одежда из натуральных тканей', 'Солнцезащитный крем SPF 50', 'Репеллент от насекомых', 'Купальник и сандалии')
  } else if (country.climate === 'desert') {
    packing.push('Головной убор и солнечные очки', 'Солнцезащитный крем', 'Тёплый свитер для вечера', 'Бутылка для воды')
  } else if (country.climate === 'nordic' || (country.climate === 'continental' && winter)) {
    packing.push('Тёплая куртка и шапка', 'Термобельё', 'Водонепроницаемые ботинки', 'Перчатки')
  } else if (summer) {
    packing.push('Лёгкая куртка на вечер', 'Солнцезащитный крем', 'Солнечные очки', 'Купальник, если есть море')
  } else {
    packing.push('Куртка или тренч', 'Слои одежды на разную погоду', 'Зонт', 'Удобные кроссовки')
  }

  if (request.interests.includes('Пляжи')) packing.push('Пляжное полотенце и крем SPF 50')
  if (request.interests.includes('Активный отдых')) packing.push('Трекинговые ботинки и сухой мешок')

  const documents = [
    'Загранпаспорт (действует ещё минимум 6 месяцев)',
    country.visa,
    'Медицинская страховка на все дни поездки',
    'Билеты, брони отелей и ваучеры — офлайн-копии',
    'Банковская карта, работающая за рубежом, и немного наличных',
  ]

  return { documents, packing: [...new Set(packing)] }
}

const buildSummary = (request, country, cities) => {
  const names = joinRu(cities.map((city) => city.name))
  const paceText =
    request.pace === 'calm'
      ? 'спокойный темп с запасом времени'
      : request.pace === 'active'
        ? 'активный темп: больше городов и впечатлений'
        : 'ровный темп без гонки'
  return `${request.days} ${plural(request.days, 'день', 'дня', 'дней')} ${country.prepositional}: ${names}. Маршрут собран под ${paceText}. Бюджет ${formatMoney(request.budget)} ₽ распределён на проживание, еду, дорогу и впечатления — с небольшим резервом на спонтанность.`
}

/**
 * Собирает готовый маршрут из каталога.
 * @param {object} rawRequest
 * @param {object} [overrides]
 */
const generatePlan = (rawRequest, overrides = {}) => {
  const request = normalizeRequest(rawRequest)
  const country = resolveCountry({ ...request, ...overrides })
  const start = parseDate(request.startDate)
  const end = parseDate(request.endDate)

  let cityPlan = []
  if (Array.isArray(overrides.cityPlan) && overrides.cityPlan.length) {
    const seen = new Set()
    cityPlan = overrides.cityPlan
      .map((item) => {
        const city = country.cities.find((entry) => entry.id === item.id)
        if (!city || seen.has(city.id)) return null
        seen.add(city.id)
        return { city, nights: Math.max(1, Math.round(Number(item.nights) || 1)), why: item.why }
      })
      .filter(Boolean)
    const nightsSum = cityPlan.reduce((sum, item) => sum + item.nights, 0)
    let remainingNights = request.nights - nightsSum
    let guard = 200
    while (cityPlan.length && remainingNights !== 0 && guard > 0) {
      guard -= 1
      if (remainingNights > 0) {
        cityPlan[cityPlan.length - 1].nights += 1
        remainingNights -= 1
        continue
      }
      const candidate = cityPlan.find((item) => item.nights > 1)
      if (!candidate) break
      candidate.nights -= 1
      remainingNights += 1
    }
  }

  if (!cityPlan.length) {
    const selected = pickCities(country, request, request.nights)
    const allocations = allocateNights(selected, request.nights)
    cityPlan = selected.map((city, index) => ({ city, nights: allocations[index] }))
  }

  const { cities, hotels } = buildCities(request, country, cityPlan, overrides.hotels || {})
  const budget = buildBudget(request, hotels)
  const days = buildDays(request, country, cities, hotels, overrides.dayThemes || {})
  const tips = buildTips(request, country, overrides.aiTips || [])
  const checklist = buildChecklist(request, country, start)

  const title = overrides.title || `${country.name}: ${joinRu(cities.map((city) => city.name))}`
  const subtitle = overrides.subtitle || country.tagline
  const summary = buildSummary(request, country, cities)

  const transferList = cities.slice(1).map((city, index) => ({
    from: cities[index].name,
    to: city.name,
    mode: country.transferModes[(index + city.name.length) % country.transferModes.length],
  }))

  return {
    id: `trip_${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    request,
    title,
    subtitle,
    summary,
    aiNote: overrides.aiNote || '',
    country: {
      id: country.id,
      name: country.name,
      prepositional: country.prepositional,
      flag: country.flag,
      region: country.region,
      tagline: country.tagline,
      description: country.description,
      scene: country.scene,
      palette: country.palette,
      currency: country.currency,
      language: country.language,
      visa: country.visa,
      climate: country.climate,
    },
    dates: {
      start: request.startDate,
      end: request.endDate,
      label: formatRange(start, end),
      year: start.getUTCFullYear(),
    },
    stats: {
      days: request.days,
      nights: request.nights,
      cities: cities.length,
      travelers: request.travelers,
      budget: request.budget,
      perPerson: Math.round(request.budget / request.travelers),
      budgetLabel: `${formatMoney(request.budget)} ₽`,
      perPersonLabel: `${formatMoney(request.budget / request.travelers)} ₽ / чел.`,
      daysLabel: `${request.days} ${plural(request.days, 'день', 'дня', 'дней')}`,
      citiesLabel: `${cities.length} ${plural(cities.length, 'город', 'города', 'городов')}`,
    },
    cities: cities.map(({ city, ...rest }) => ({
      ...rest,
      nights: cityPlan.find((item) => item.city.id === city.id)?.nights || rest.nights,
    })),
    hotels,
    budget,
    days,
    transfers: transferList,
    tips,
    checklist,
    meta: {
      source: overrides.source || 'atlas',
      model: overrides.model || 'Atlas Engine 1.0',
      generatedAt: new Date().toISOString(),
      disclaimer: 'Цены и время в маршруте ориентировочные. Проверяйте бронирования перед поездкой.',
      aiNote: overrides.aiNote || '',
    },
  }
}

module.exports = {
  generatePlan,
  normalizeRequest,
  resolveCountry,
  formatMoney,
  formatRange,
  plural,
  parseDate,
  CLIMATE_TEMPS,
  MONTHS,
  WEEKDAYS,
}
