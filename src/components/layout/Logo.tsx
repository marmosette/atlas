import { Box, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

interface LogoProps {
  compact?: boolean
  light?: boolean
}

export const Logo = ({ compact = false, light = false }: LogoProps) => {
  const color = light ? '#F6F1E7' : '#16302B'
  return (
    <Link to="/" aria-label="Атлас — на главную" style={{ display: 'inline-flex' }}>
      <Flex align="center" gap={compact ? 2.5 : 3} color={color}>
        <Box position="relative" w={compact ? '32px' : '40px'} h={compact ? '32px' : '40px'} flexShrink={0}>
          <svg viewBox="0 0 48 48" width="100%" height="100%" aria-hidden="true">
            <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeOpacity="0.24" strokeWidth="1" strokeDasharray="3 4" />
            <circle cx="24" cy="24" r="15.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path d="M24 7.5c1.2 7.8 3.6 10.2 11.4 11.4-7.8 1.2-10.2 3.6-11.4 11.4-1.2-7.8-3.6-10.2-11.4-11.4C20.4 17.7 22.8 15.3 24 7.5Z" fill="#C96F4A" />
            <circle cx="24" cy="24" r="2.4" fill={color} />
          </svg>
        </Box>
        <Box>
          <Text
            fontFamily="heading"
            fontSize={compact ? 'lg' : 'xl'}
            lineHeight="1"
            letterSpacing="0.18em"
            textTransform="uppercase"
          >
            Атлас
          </Text>
          {!compact && (
            <Text
              mt="4px"
              fontSize="8px"
              fontWeight={700}
              letterSpacing="0.26em"
              textTransform="uppercase"
              opacity={0.55}
            >
              travel atelier
            </Text>
          )}
        </Box>
      </Flex>
    </Link>
  )
}
