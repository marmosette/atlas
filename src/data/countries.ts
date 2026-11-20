// Сгенерировано скриптом scripts/sync-countries.mjs. Не редактируйте вручную.
import type { CountryCard, CountryOption } from '../types'

export const fallbackCountries: CountryOption[] = [
  {
    "id": "georgia",
    "name": "Грузия",
    "flag": "🇬🇪",
    "region": "Кавказ",
    "tagline": "Вино, горы и гостеприимство",
    "scene": "mountains",
    "palette": [
      "#E9B44C",
      "#C96F4A",
      "#315A4B"
    ],
    "fromPrice": 58000,
    "cities": 4,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "armenia",
    "name": "Армения",
    "flag": "🇦🇲",
    "region": "Кавказ",
    "tagline": "Монастыри, абрикосы и Арарат",
    "scene": "mountains",
    "palette": [
      "#E3A957",
      "#B8553A",
      "#3E5C4B"
    ],
    "fromPrice": 52000,
    "cities": 3,
    "bestMonths": [
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "turkey",
    "name": "Турция",
    "flag": "🇹🇷",
    "region": "Средиземноморье",
    "tagline": "От стамбульских базаров до воздушных шаров",
    "scene": "coast",
    "palette": [
      "#E7B35B",
      "#B8483C",
      "#2F5D62"
    ],
    "fromPrice": 64000,
    "cities": 3,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "italy",
    "name": "Италия",
    "flag": "🇮🇹",
    "region": "Европа",
    "tagline": "Искусство, паста и dolce vita",
    "scene": "city",
    "palette": [
      "#E2B45B",
      "#B65A3F",
      "#3E6B5B"
    ],
    "fromPrice": 98000,
    "cities": 4,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "spain",
    "name": "Испания",
    "flag": "🇪🇸",
    "region": "Европа",
    "tagline": "Гауди, тапас и поздние ужины",
    "scene": "city",
    "palette": [
      "#E8B04B",
      "#C25B3F",
      "#3D6A5D"
    ],
    "fromPrice": 92000,
    "cities": 3,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "france",
    "name": "Франция",
    "flag": "🇫🇷",
    "region": "Европа",
    "tagline": "Париж, Лазурный берег и вино",
    "scene": "city",
    "palette": [
      "#E4B45C",
      "#B65C47",
      "#355F63"
    ],
    "fromPrice": 112000,
    "cities": 3,
    "bestMonths": [
      5,
      6,
      7,
      9,
      10
    ]
  },
  {
    "id": "portugal",
    "name": "Португалия",
    "flag": "🇵🇹",
    "region": "Европа",
    "tagline": "Атлантика, азулежу и паштейш",
    "scene": "coast",
    "palette": [
      "#E7B25A",
      "#B75B41",
      "#31625A"
    ],
    "fromPrice": 82000,
    "cities": 3,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "greece",
    "name": "Греция",
    "flag": "🇬🇷",
    "region": "Средиземноморье",
    "tagline": "Белое и синее, античность и море",
    "scene": "coast",
    "palette": [
      "#E8B95B",
      "#BD5C47",
      "#316B72"
    ],
    "fromPrice": 88000,
    "cities": 3,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "montenegro",
    "name": "Черногория",
    "flag": "🇲🇪",
    "region": "Балканы",
    "tagline": "Адриатика, каньоны и старые города",
    "scene": "coast",
    "palette": [
      "#E4B65E",
      "#B85C45",
      "#2F5D55"
    ],
    "fromPrice": 62000,
    "cities": 3,
    "bestMonths": [
      5,
      6,
      7,
      9,
      10
    ]
  },
  {
    "id": "czech",
    "name": "Чехия",
    "flag": "🇨🇿",
    "region": "Европа",
    "tagline": "Прага, пиво и сказочные городки",
    "scene": "city",
    "palette": [
      "#E4B35C",
      "#B75B44",
      "#35605A"
    ],
    "fromPrice": 68000,
    "cities": 3,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "japan",
    "name": "Япония",
    "flag": "🇯🇵",
    "region": "Азия",
    "tagline": "Токио, Киото и тишина садов",
    "scene": "city",
    "palette": [
      "#E8B9A9",
      "#B54A4A",
      "#2E4A4F"
    ],
    "fromPrice": 148000,
    "cities": 4,
    "bestMonths": [
      3,
      4,
      5,
      10,
      11
    ]
  },
  {
    "id": "thailand",
    "name": "Таиланд",
    "flag": "🇹🇭",
    "region": "Азия",
    "tagline": "Уличная еда, храмы и Андаманское море",
    "scene": "tropical",
    "palette": [
      "#F0C75E",
      "#D26A4A",
      "#2F7A6A"
    ],
    "fromPrice": 96000,
    "cities": 3,
    "bestMonths": [
      11,
      12,
      1,
      2,
      3
    ]
  },
  {
    "id": "morocco",
    "name": "Марокко",
    "flag": "🇲🇦",
    "region": "Африка",
    "tagline": "Медины, специи и Сахара",
    "scene": "desert",
    "palette": [
      "#E9B75C",
      "#C4603F",
      "#8C3B4A"
    ],
    "fromPrice": 94000,
    "cities": 3,
    "bestMonths": [
      3,
      4,
      5,
      10,
      11
    ]
  },
  {
    "id": "uzbekistan",
    "name": "Узбекистан",
    "flag": "🇺🇿",
    "region": "Азия",
    "tagline": "Шёлковый путь и бирюзовые купола",
    "scene": "desert",
    "palette": [
      "#E7B65B",
      "#3A8A8A",
      "#8C4B3E"
    ],
    "fromPrice": 58000,
    "cities": 3,
    "bestMonths": [
      4,
      5,
      9,
      10
    ]
  },
  {
    "id": "uae",
    "name": "ОАЭ",
    "flag": "🇦🇪",
    "region": "Ближний Восток",
    "tagline": "Небоскрёбы, пустыня и море",
    "scene": "desert",
    "palette": [
      "#E9C06A",
      "#C27A48",
      "#3C6172"
    ],
    "fromPrice": 112000,
    "cities": 2,
    "bestMonths": [
      11,
      12,
      1,
      2,
      3
    ]
  },
  {
    "id": "russia",
    "name": "Россия",
    "flag": "🇷🇺",
    "region": "Россия",
    "tagline": "От Москвы до Байкала",
    "scene": "city",
    "palette": [
      "#E2B25D",
      "#B85B42",
      "#335B52"
    ],
    "fromPrice": 42000,
    "cities": 3,
    "bestMonths": [
      5,
      6,
      7,
      8,
      9
    ]
  }
]

export const fallbackFeatured: CountryCard[] = [
  {
    "id": "georgia",
    "name": "Грузия",
    "flag": "🇬🇪",
    "region": "Кавказ",
    "tagline": "Вино, горы и гостеприимство",
    "description": "Компактная страна, где за одну поездку можно успеть поужинать в Тбилиси, подняться к Троицкой церкви под Казбеги и продегустировать саперави в Кахетии.",
    "scene": "mountains",
    "palette": [
      "#E9B44C",
      "#C96F4A",
      "#315A4B"
    ],
    "fromPrice": 58000,
    "cities": 4,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "italy",
    "name": "Италия",
    "flag": "🇮🇹",
    "region": "Европа",
    "tagline": "Искусство, паста и dolce vita",
    "description": "Рим, Флоренция, Венеция — классика, которая не надоедает. А между ними — тосканские холмы, лигурийское побережье и лучшая паста в вашей жизни.",
    "scene": "city",
    "palette": [
      "#E2B45B",
      "#B65A3F",
      "#3E6B5B"
    ],
    "fromPrice": 98000,
    "cities": 4,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "japan",
    "name": "Япония",
    "flag": "🇯🇵",
    "region": "Азия",
    "tagline": "Токио, Киото и тишина садов",
    "description": "Неоновый Токио, храмы Киото, Осака с улицей еды и тихие источники Хаконэ. Япония — про контрасты, которые не мешают друг другу.",
    "scene": "city",
    "palette": [
      "#E8B9A9",
      "#B54A4A",
      "#2E4A4F"
    ],
    "fromPrice": 148000,
    "cities": 4,
    "bestMonths": [
      3,
      4,
      5,
      10,
      11
    ]
  },
  {
    "id": "turkey",
    "name": "Турция",
    "flag": "🇹🇷",
    "region": "Средиземноморье",
    "tagline": "От стамбульских базаров до воздушных шаров",
    "description": "Стамбул с его дворцами, Каппадокия с шарами на рассвете и тёплое море Анталии. Турция умеет быть и городской, и курортной — в одной поездке.",
    "scene": "coast",
    "palette": [
      "#E7B35B",
      "#B8483C",
      "#2F5D62"
    ],
    "fromPrice": 64000,
    "cities": 3,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "spain",
    "name": "Испания",
    "flag": "🇪🇸",
    "region": "Европа",
    "tagline": "Гауди, тапас и поздние ужины",
    "description": "Барселона с Гауди, Мадрид с музеями и Севилья с фламенко. Испания — про ритм: днём сиеста, вечером тапас-бар и разговоры до двух ночи.",
    "scene": "city",
    "palette": [
      "#E8B04B",
      "#C25B3F",
      "#3D6A5D"
    ],
    "fromPrice": 92000,
    "cities": 3,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  },
  {
    "id": "thailand",
    "name": "Таиланд",
    "flag": "🇹🇭",
    "region": "Азия",
    "tagline": "Уличная еда, храмы и Андаманское море",
    "description": "Бангкок с храмами и рынками, Чиангмай с горами и Краби с известняковыми скалами. Таиланд — тёплый, вкусный и очень дружелюбный.",
    "scene": "tropical",
    "palette": [
      "#F0C75E",
      "#D26A4A",
      "#2F7A6A"
    ],
    "fromPrice": 96000,
    "cities": 3,
    "bestMonths": [
      11,
      12,
      1,
      2,
      3
    ]
  },
  {
    "id": "uzbekistan",
    "name": "Узбекистан",
    "flag": "🇺🇿",
    "region": "Азия",
    "tagline": "Шёлковый путь и бирюзовые купола",
    "description": "Самарканд, Бухара и Хива — три жемчужины Шёлкового пути. Плюс плов, лепёшки и очень тёплый приём.",
    "scene": "desert",
    "palette": [
      "#E7B65B",
      "#3A8A8A",
      "#8C4B3E"
    ],
    "fromPrice": 58000,
    "cities": 3,
    "bestMonths": [
      4,
      5,
      9,
      10
    ]
  },
  {
    "id": "portugal",
    "name": "Португалия",
    "flag": "🇵🇹",
    "region": "Европа",
    "tagline": "Атлантика, азулежу и паштейш",
    "description": "Лиссабон на холмах, Порту с портвейном и Синтра с дворцами. Португалия — недорогая, солнечная и очень душевная альтернатива Италии.",
    "scene": "coast",
    "palette": [
      "#E7B25A",
      "#B75B41",
      "#31625A"
    ],
    "fromPrice": 82000,
    "cities": 3,
    "bestMonths": [
      4,
      5,
      6,
      9,
      10
    ]
  }
]
