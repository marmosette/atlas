import { useId } from 'react'

interface DestinationArtProps {
  scene?: string
  palette?: [string, string, string]
  className?: string
  variant?: 'card' | 'hero' | 'thumb'
}

const DEFAULT_PALETTE: [string, string, string] = ['#E9B44C', '#C96F4A', '#315A4B']

const Sun = ({ x, y, r, color = '#F6D28A', opacity = 0.95 }: { x: number; y: number; r: number; color?: string; opacity?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r * 2.4} fill={color} opacity={0.12} />
    <circle cx={x} cy={y} r={r} fill={color} opacity={opacity} />
  </g>
)

const Birds = ({ color = '#16302B', opacity = 0.45, offset = 0 }: { color?: string; opacity?: number; offset?: number }) => (
  <g stroke={color} strokeWidth="2" fill="none" opacity={opacity} strokeLinecap="round">
    <path d={`M${140 + offset} 120 q7-7 14 0 q7-7 14 0`} />
    <path d={`M${188 + offset} 98 q5-5 10 0 q5-5 10 0`} />
    <path d={`M${250 + offset} 140 q4-4 8 0 q4-4 8 0`} />
  </g>
)

const Mountains = ({ palette }: { palette: [string, string, string] }) => (
  <>
    <Sun x={430} y={118} r={38} color="#F8DCA5" />
    <Birds />
    <path d="M0 268 70 190 132 238 214 128 288 232 346 178 420 248 486 194 552 246 600 210V420H0Z" fill={palette[2]} opacity={0.28} />
    <path d="M0 312 92 226 164 284 258 168 342 286 422 224 508 300 600 250V420H0Z" fill={palette[1]} opacity={0.62} />
    <path d="m206 202 52 66-28-12-16 18-18-24-22 6Z" fill="#FBF3E5" opacity={0.8} />
    <path d="m466 248 38 46-22-10-12 14-12-18-16 6Z" fill="#FBF3E5" opacity={0.65} />
    <path d="M0 356 76 306 158 348 252 292 332 352 438 300 520 354 600 310V420H0Z" fill={palette[2]} opacity={0.86} />
    <path d="M0 420 0 390 120 354 240 396 360 358 480 400 600 366V420Z" fill="#162F2A" />
    <path d="M0 402c90-8 170 6 250-2s150-22 226-10 96 10 124 6v24H0Z" fill="#122722" opacity={0.9} />
  </>
)

const Coast = ({ palette }: { palette: [string, string, string] }) => (
  <>
    <Sun x={446} y={112} r={44} color="#F7D18B" />
    <Birds offset={-30} />
    <path d="M0 252h600v168H0Z" fill={palette[2]} opacity={0.55} />
    <path d="M0 252h600v14H0Z" fill="#F7E8CC" opacity={0.8} />
    <path d="M0 252 84 204 150 244 206 218 262 252Z" fill={palette[1]} opacity={0.8} />
    <path d="M0 252 70 226 128 252Z" fill={palette[2]} opacity={0.7} />
    <path d="M408 252 468 196 512 224 548 200 600 252Z" fill={palette[1]} opacity={0.55} />
    <path d="M380 258h66l-12 18h-42Z" fill="#16302B" opacity={0.8} />
    <path d="M412 258v-46l34 22-34 12" fill="#FBF3E5" opacity={0.92} />
    <path d="M412 212v46" stroke="#16302B" strokeWidth="2" opacity={0.6} />
    <g stroke="#F8EBD2" strokeWidth="2" opacity={0.55} fill="none">
      <path d="M0 296c60-10 120 10 180 0s120-10 180 0 120 10 180 0 60-6 60-6" />
      <path d="M0 330c60-10 120 10 180 0s120-10 180 0 120 10 180 0 60-6 60-6" />
      <path d="M0 370c60-10 120 10 180 0s120-10 180 0 120 10 180 0 60-6 60-6" />
    </g>
    <path d="M470 280c0 10 6 14 6 14s6-4 6-14Z" fill="#16302B" opacity={0.55} />
    <path d="M470 280h12" stroke="#16302B" strokeWidth="2" opacity={0.55} />
  </>
)

const City = ({ palette }: { palette: [string, string, string] }) => (
  <>
    <Sun x={466} y={116} r={42} color="#F8D89C" />
    <Birds offset={-10} />
    <rect x="0" y="250" width="600" height="170" fill={palette[2]} opacity={0.18} />
    <g fill={palette[2]} opacity={0.34}>
      <rect x="18" y="220" width="52" height="110" rx="3" />
      <rect x="82" y="246" width="38" height="84" rx="3" />
      <rect x="132" y="204" width="64" height="126" rx="3" />
      <rect x="208" y="236" width="46" height="94" rx="3" />
      <rect x="266" y="190" width="58" height="140" rx="3" />
      <rect x="474" y="230" width="48" height="100" rx="3" />
      <rect x="534" y="208" width="56" height="122" rx="3" />
    </g>
    <g fill={palette[1]} opacity={0.68}>
      <path d="M338 330V214l26-34 26 34v116Z" />
      <path d="M390 330V250l20-24 20 24v80Z" />
      <path d="M324 330v-62l20-24 20 24v62Z" opacity={0.75} />
    </g>
    <path d="M364 180c-10 0-18 8-18 18v8h36v-8c0-10-8-18-18-18Z" fill="#FBF3E5" opacity={0.8} />
    <path d="M364 174v8" stroke={palette[2]} strokeWidth="3" />
    <g fill="#F8E8C9" opacity={0.85}>
      <rect x="34" y="234" width="6" height="10" />
      <rect x="52" y="234" width="6" height="10" />
      <rect x="34" y="258" width="6" height="10" />
      <rect x="52" y="258" width="6" height="10" />
      <rect x="148" y="220" width="6" height="10" />
      <rect x="168" y="220" width="6" height="10" />
      <rect x="148" y="246" width="6" height="10" />
      <rect x="168" y="246" width="6" height="10" />
      <rect x="280" y="206" width="6" height="10" />
      <rect x="300" y="206" width="6" height="10" />
      <rect x="280" y="230" width="6" height="10" />
      <rect x="300" y="230" width="6" height="10" />
      <rect x="496" y="246" width="6" height="10" />
      <rect x="556" y="224" width="6" height="10" />
    </g>
    <path d="M0 330h600v90H0Z" fill="#16302B" opacity={0.9} />
    <path d="M0 350c100-14 180 8 280 0s170-18 250-6 70 10 70 10v66H0Z" fill="#122722" />
    <path d="M84 420v-38M142 420v-46M470 420v-34M526 420v-44" stroke="#0E1F1B" strokeWidth="2" opacity={0.7} />
  </>
)

const Desert = ({ palette }: { palette: [string, string, string] }) => (
  <>
    <Sun x={432} y={112} r={48} color="#F6CB7C" />
    <Birds offset={-60} opacity={0.3} />
    <path d="M0 286c90-36 150 12 236-10s160-40 240-12 104 20 124 12v144H0Z" fill={palette[1]} opacity={0.55} />
    <path d="M0 330c80-30 156 20 248-4s160-26 236-4 88 12 116 6v92H0Z" fill={palette[1]} opacity={0.76} />
    <path d="M0 374c110-28 178 14 280-6s160-20 230-2 70 8 90 6v48H0Z" fill="#8A4D37" opacity={0.9} />
    <path d="M0 404c110-18 200 6 300-4s180-8 300 4v16H0Z" fill="#16302B" opacity={0.85} />
    <g fill="#16302B" opacity={0.55}>
      <path d="M470 362c2-10 10-16 20-16 10 0 18 6 20 16h-8l-4 8h-6l-2-8h-8l-2 8h-6Z" />
      <circle cx="490" cy="342" r="3" />
      <path d="M510 366c1-7 6-11 13-11s12 4 13 11h-5l-3 6h-4l-1-6h-6Z" />
    </g>
    <g stroke="#16302B" strokeWidth="2" opacity={0.35} fill="none">
      <path d="M80 294c30-8 60 0 84-8" />
      <path d="M380 318c26-6 50 2 72-6" />
    </g>
  </>
)

const Tropical = ({ palette }: { palette: [string, string, string] }) => (
  <>
    <Sun x={440} y={108} r={46} color="#F8D79B" />
    <path d="M0 250h600v170H0Z" fill={palette[2]} opacity={0.45} />
    <path d="M0 250h600v12H0Z" fill="#F8EBD2" opacity={0.7} />
    <path d="M0 250c70-18 120 2 168-16 40-15 54 6 84-4v20Z" fill={palette[2]} opacity={0.55} />
    <path d="M0 420c80-40 160-4 240-20s140-30 220-10 100 10 140 4v26Z" fill="#16302B" opacity={0.8} />
    <g fill={palette[2]} opacity={0.82}>
      <path d="M84 420c2-76 10-120 30-156 8 36 12 80 12 156Z" />
      <path d="M84 420c2-86 10-132 30-166" stroke="#16302B" strokeWidth="5" fill="none" opacity={0.7} />
      <path d="M114 262c-22-18-44-20-62-12 18 4 30 12 38 24-18-2-32 2-42 12 18-2 32 0 46 8-12 18-12 34-4 46 2-18 10-32 24-42 8 16 20 26 36 30-8-16-10-30-6-42 14 8 28 8 40 2-14-4-24-12-30-24Z" />
    </g>
    <g fill={palette[2]} opacity={0.55}>
      <path d="M520 420c0-40 4-64 14-82 6 20 8 46 8 82Z" />
      <path d="M534 338c-14-10-28-12-38-8 10 4 18 10 22 18-10-2-18 0-24 8 10-2 20 0 28 6-6 10-6 18-2 26 2-10 6-18 14-24 4 10 10 16 18 18-4-10-4-18 0-26 8 4 16 4 22 0-8-2-14-8-18-16Z" />
    </g>
    <g stroke="#F8EBD2" strokeWidth="2" opacity={0.5} fill="none">
      <path d="M60 298c50-8 100 8 150 0s100-8 150 0 100 8 150 0" />
      <path d="M30 338c50-8 100 8 150 0s100-8 150 0 100 8 150 0" />
    </g>
    <path d="M300 286h50l-8 12h-34Z" fill="#FBF3E5" opacity={0.8} />
    <path d="M325 286v-34l28 20-28 12" fill="#FBF3E5" opacity={0.9} />
  </>
)

const Forest = ({ palette }: { palette: [string, string, string] }) => (
  <>
    <Sun x={438} y={106} r={34} color="#F7D79C" opacity={0.75} />
    <path d="M0 300 74 214 142 282 220 190 300 286 366 220 448 296 514 228 600 292V420H0Z" fill={palette[2]} opacity={0.24} />
    <path d="M0 330 88 260 162 318 248 246 330 326 410 264 492 330 560 286 600 312V420H0Z" fill={palette[2]} opacity={0.38} />
    <g fill={palette[2]} opacity={0.82}>
      {[
        [64, 320, 36],
        [110, 342, 46],
        [164, 324, 40],
        [228, 350, 56],
        [290, 326, 42],
        [356, 348, 52],
        [424, 322, 38],
        [488, 344, 48],
        [552, 326, 36],
      ].map(([x, y, height], index) => (
        <g key={index}>
          <path d={`M${x} ${y} ${x - height * 0.34} ${y} ${x} ${y - height} ${x + height * 0.34} ${y}Z`} />
          <path d={`M${x} ${y + 14} ${x - height * 0.4} ${y + 14} ${x} ${y - height * 0.72} ${x + height * 0.4} ${y + 14}Z`} opacity={0.85} />
        </g>
      ))}
    </g>
    <path d="M0 420v-50c90-16 150 8 250-4s170-18 250 0 100 8 100 8v46Z" fill="#16302B" opacity={0.9} />
    <g fill="#F8EBD2" opacity={0.25}>
      <ellipse cx="150" cy="270" rx="90" ry="12" />
      <ellipse cx="430" cy="250" rx="80" ry="10" />
    </g>
  </>
)

const Hills = ({ palette }: { palette: [string, string, string] }) => (
  <>
    <Sun x={448} y={112} r={38} color="#F7D18B" />
    <Birds offset={-40} />
    <path d="M0 280c90-40 170 10 260-18s180-24 260 4 80 14 80 14v140H0Z" fill={palette[2]} opacity={0.25} />
    <path d="M0 318c110-46 190 12 296-16s168-22 244 4 60 12 60 12v102H0Z" fill={palette[2]} opacity={0.4} />
    <path d="M0 360c100-34 200 16 300-8s190-20 300 6v62H0Z" fill={palette[1]} opacity={0.7} />
    <path d="M0 396c120-24 220 8 320-4s180-10 280 4v24H0Z" fill="#16302B" opacity={0.88} />
    <g fill={palette[2]} opacity={0.78}>
      <path d="M120 344c-4-32 2-58 10-76 8 20 12 46 10 76Z" />
      <path d="M186 352c-3-26 2-48 8-64 6 18 9 38 8 64Z" />
      <path d="M470 340c-4-30 2-56 10-74 8 20 12 44 10 74Z" />
      <path d="M528 348c-3-24 2-44 8-60 6 16 9 36 8 60Z" />
    </g>
    <g fill="#FBF3E5" opacity={0.85}>
      <path d="M254 360h50v30h-50Z" />
      <path d="M248 360 279 340l31 20Z" fill={palette[1]} />
      <rect x="272" y="374" width="9" height="16" fill="#16302B" opacity={0.6} />
    </g>
  </>
)

const Lake = ({ palette }: { palette: [string, string, string] }) => (
  <>
    <Sun x={452} y={104} r={34} color="#F7D79C" />
    <Birds offset={-50} />
    <path d="M0 252 80 178 148 236 232 148 318 242 388 186 458 244 528 190 600 240V300H0Z" fill={palette[2]} opacity={0.38} />
    <path d="m206 190 40 58-22-10-12 14-12-18-14 4Z" fill="#FBF3E5" opacity={0.75} />
    <path d="M0 290h600v130H0Z" fill={palette[2]} opacity={0.45} />
    <path d="M0 290h600v8H0Z" fill="#F8EBD2" opacity={0.7} />
    <path d="M0 304h600v116H0Z" fill={palette[1]} opacity={0.22} />
    <g stroke="#F8EBD2" strokeWidth="2" opacity={0.4} fill="none">
      <path d="M40 326c50-6 100 6 150 0s100-6 150 0 100 6 150 0" />
      <path d="M100 356c50-6 100 6 150 0s100-6 150 0" />
      <path d="M60 390c50-6 100 6 150 0s100-6 150 0 100 6 150 0" />
    </g>
    <path d="M390 330h50l-8 12h-34Z" fill="#FBF3E5" opacity={0.8} />
    <path d="M415 330v-30l26 18-26 12" fill="#FBF3E5" opacity={0.9} />
    <path d="M0 420v-30c90-20 160 8 250-4s180-12 250 2 100 8 100 8v24Z" fill="#16302B" opacity={0.86} />
  </>
)

export const DestinationArt = ({
  scene = 'mountains',
  palette = DEFAULT_PALETTE,
  className,
  variant = 'card',
}: DestinationArtProps) => {
  const filterId = useId().replace(/:/g, '')
  const gradientId = `sky-${filterId}`
  const grainId = `grain-${filterId}`
  const height = variant === 'hero' ? 520 : variant === 'thumb' ? 180 : 420
  const width = variant === 'hero' ? 760 : 600

  const sceneContent =
    scene === 'coast' ? (
      <Coast palette={palette} />
    ) : scene === 'city' ? (
      <City palette={palette} />
    ) : scene === 'desert' ? (
      <Desert palette={palette} />
    ) : scene === 'tropical' ? (
      <Tropical palette={palette} />
    ) : scene === 'forest' ? (
      <Forest palette={palette} />
    ) : scene === 'hills' ? (
      <Hills palette={palette} />
    ) : scene === 'lake' ? (
      <Lake palette={palette} />
    ) : (
      <Mountains palette={palette} />
    )

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      role="img"
      aria-label="Иллюстрация направления"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette[0]} stopOpacity="0.48" />
          <stop offset="55%" stopColor="#F6E5CC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F1DCC0" stopOpacity="1" />
        </linearGradient>
        <filter id={grainId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.12" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width={width} height={height} fill={`url(#${gradientId})`} />
      <g transform={variant === 'hero' ? 'scale(1.12) translate(-32 -30)' : undefined}>{sceneContent}</g>
      <rect width={width} height={height} filter={`url(#${grainId})`} opacity={0.5} style={{ mixBlendMode: 'multiply' }} />
      <rect width={width} height={height} fill="none" stroke="#16302B" strokeOpacity="0.06" />
    </svg>
  )
}
