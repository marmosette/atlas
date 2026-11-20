import { Box, type BoxProps } from '@chakra-ui/react'
import { type ReactNode } from 'react'

interface Segment {
  percent: number
  color: string
}

interface BudgetRingProps extends BoxProps {
  segments: Segment[]
  size?: number
  thickness?: number
  children?: ReactNode
  trackColor?: string
}

export const BudgetRing = ({
  segments,
  size = 180,
  thickness = 14,
  children,
  trackColor = '#EFE5D4',
  ...rest
}: BudgetRingProps) => {
  let offset = 0
  return (
    <Box position="relative" w={`${size}px`} h={`${size}px`} flexShrink={0} {...rest}>
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden="true">
        <circle cx="60" cy="60" r="52" fill="none" stroke={trackColor} strokeWidth={thickness} />
        {segments.map((segment, index) => {
          const gap = segments.length > 1 ? 0.6 : 0
          const value = Math.max(segment.percent - gap, 0.4)
          const element = (
            <circle
              key={index}
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={segment.color}
              strokeWidth={thickness}
              pathLength={100}
              strokeDasharray={`${value} ${100 - value}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dasharray .8s cubic-bezier(.22,1,.36,1)' }}
            />
          )
          offset += segment.percent
          return element
        })}
      </svg>
      <Box position="absolute" inset={0} display="grid" placeItems="center">
        {children}
      </Box>
    </Box>
  )
}
