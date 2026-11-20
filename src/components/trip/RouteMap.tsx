import { Box, Text } from '@chakra-ui/react'

import type { CityStop } from '../../types'

interface RouteMapProps {
  cities: CityStop[]
  palette: [string, string, string]
}

const buildPath = (points: { x: number; y: number }[]) => {
  if (points.length === 1) return `M ${points[0].x - 60} ${points[0].y} L ${points[0].x + 60} ${points[0].y}`
  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1]
    const current = points[index]
    const midX = (previous.x + current.x) / 2
    path += ` C ${midX} ${previous.y}, ${midX} ${current.y}, ${current.x} ${current.y}`
  }
  return path
}

export const RouteMap = ({ cities, palette }: RouteMapProps) => {
  const width = 900
  const height = 210
  const count = cities.length
  const points = cities.map((_, index) => {
    if (count === 1) return { x: width / 2, y: 108 }
    const x = 90 + (index * (width - 180)) / (count - 1)
    const y = 108 + Math.sin(index * 1.5) * 30
    return { x, y }
  })
  const path = buildPath(points)

  return (
    <Box w="100%" overflow="hidden">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" role="img" aria-label="Карта маршрута">
        <defs>
          <linearGradient id="route-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={palette[1]} />
            <stop offset="100%" stopColor={palette[2]} />
          </linearGradient>
        </defs>

        <g opacity={0.22} stroke="#16302B" strokeWidth="1">
          {Array.from({ length: 9 }).map((_, index) => (
            <path
              key={index}
              d={`M0 ${40 + index * 22} C 180 ${20 + index * 22}, 320 ${60 + index * 22}, 460 ${40 + index * 22} S 760 ${20 + index * 22}, 900 ${40 + index * 22}`}
              fill="none"
              strokeDasharray="2 8"
            />
          ))}
        </g>

        <path d={path} fill="none" stroke="rgba(22,48,43,0.14)" strokeWidth="7" strokeLinecap="round" />
        <path
          d={path}
          fill="none"
          stroke="url(#route-gradient)"
          strokeWidth="2.5"
          strokeDasharray="7 8"
          strokeLinecap="round"
          style={{ animation: 'dash 24s linear infinite' }}
        />
        <style>{`@keyframes dash { to { stroke-dashoffset: -300; } }`}</style>

        <g>
          <circle r="4.5" fill={palette[1]}>
            <animateMotion dur="14s" repeatCount="indefinite" path={path} />
          </circle>
          <circle r="10" fill={palette[1]} opacity="0.18">
            <animateMotion dur="14s" repeatCount="indefinite" path={path} />
          </circle>
        </g>

        {points.map((point, index) => {
          const city = cities[index]
          const labelY = index % 2 === 0 ? point.y - 34 : point.y + 48
          const anchor = index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'
          return (
            <g key={city.id}>
              <line x1={point.x} y1={point.y} x2={point.x} y2={labelY + (index % 2 === 0 ? 8 : -18)} stroke="#16302B" strokeOpacity="0.22" strokeDasharray="2 3" />
              <circle cx={point.x} cy={point.y} r="17" fill="#FCF9F2" stroke={palette[2]} strokeWidth="1.6" />
              <circle cx={point.x} cy={point.y} r="6" fill={palette[1]} />
              <circle cx={point.x} cy={point.y} r="13" fill="none" stroke={palette[1]} strokeOpacity="0.28" strokeWidth="1" />
              <text
                x={point.x}
                y={labelY}
                textAnchor={anchor}
                fontFamily="'Prata', Georgia, serif"
                fontSize="19"
                fill="#16302B"
              >
                {city.name}
              </text>
              <text
                x={point.x}
                y={labelY + (index % 2 === 0 ? 16 : 15)}
                textAnchor={anchor}
                fontFamily="'Manrope', sans-serif"
                fontSize="10"
                fontWeight="700"
                letterSpacing="1.2"
                fill="#6C7A72"
              >
                {city.nights} {city.nights === 1 ? 'НОЧЬ' : city.nights < 5 ? 'НОЧИ' : 'НОЧЕЙ'}
              </text>
            </g>
          )
        })}
      </svg>
      <Text mt={1} textAlign="center" fontSize="10px" color="muted" letterSpacing="0.12em" textTransform="uppercase">
        Схема маршрута · {cities.length} {cities.length === 1 ? 'остановка' : cities.length < 5 ? 'остановки' : 'остановок'}
      </Text>
    </Box>
  )
}
