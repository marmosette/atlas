import { createRequire } from 'node:module'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const require = createRequire(import.meta.url)
const { getCountryOptions, getFeaturedCountries } = require('../stubs/api/catalog.js')

const countries = getCountryOptions()
const featured = getFeaturedCountries().map((country) => ({
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
}))

const content = `// Сгенерировано скриптом scripts/sync-countries.mjs. Не редактируйте вручную.
import type { CountryCard, CountryOption } from '../types'

export const fallbackCountries: CountryOption[] = ${JSON.stringify(countries, null, 2)}

export const fallbackFeatured: CountryCard[] = ${JSON.stringify(featured, null, 2)}
`

const target = path.resolve('src/data/countries.ts')
await mkdir(path.dirname(target), { recursive: true })
await writeFile(target, content, 'utf8')
console.log(`Generated ${target}: ${countries.length} countries, ${featured.length} featured`)
