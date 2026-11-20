import { Box, Flex, Input, Text } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { CountryOption } from '../../types'
import { formatMoney } from '../../utils/format'
import { Icon } from '../ui/Icon'

const CODES: Record<string, string> = {
  georgia: 'GE',
  armenia: 'AM',
  turkey: 'TR',
  italy: 'IT',
  spain: 'ES',
  france: 'FR',
  portugal: 'PT',
  greece: 'GR',
  montenegro: 'ME',
  czech: 'CZ',
  japan: 'JP',
  thailand: 'TH',
  morocco: 'MA',
  uzbekistan: 'UZ',
  uae: 'AE',
  russia: 'RU',
}

interface CountryMarkProps {
  country?: Pick<CountryOption, 'id' | 'palette'>
  size?: number
  code?: string
}

export const CountryMark = ({ country, size = 36, code }: CountryMarkProps) => {
  const letters = code || (country ? CODES[country.id] || country.id.slice(0, 2).toUpperCase() : 'AT')
  const palette = country?.palette || ['#E9B44C', '#C96F4A', '#315A4B']
  return (
    <Box
      w={`${size}px`}
      h={`${size}px`}
      flexShrink={0}
      borderRadius={size > 44 ? '12px' : '10px'}
      overflow="hidden"
      position="relative"
      bg={palette[2]}
      color="#FCF9F2"
      display="grid"
      placeItems="center"
      fontSize={`${Math.max(9, Math.round(size * 0.28))}px`}
      fontWeight={800}
      letterSpacing="0.08em"
    >
      <Box
        position="absolute"
        inset="0"
        bg={`linear-gradient(135deg, ${palette[0]} 0%, ${palette[1]} 100%)`}
        opacity={0.92}
      />
      <Box position="absolute" left="-10%" right="-10%" top="62%" h="1px" bg="rgba(252,249,242,0.5)" transform="rotate(-22deg)" />
      <Box position="relative" zIndex={1}>
        {letters}
      </Box>
    </Box>
  )
}

interface CountrySelectProps {
  countries: CountryOption[]
  value: string
  onChange: (value: string) => void
  error?: string
  loading?: boolean
}

export const CountrySelect = ({ countries, value, onChange, error, loading }: CountrySelectProps) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = countries.find((country) => country.id === value)

  useEffect(() => {
    if (!open) {
      setQuery('')
      return undefined
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.setTimeout(() => inputRef.current?.focus(), 30)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return countries
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(normalized) ||
        country.region.toLowerCase().includes(normalized) ||
        country.tagline.toLowerCase().includes(normalized)
    )
  }, [countries, query])

  const select = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  return (
    <Box ref={rootRef} position="relative" w="100%">
      <Box
        as="button"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Выберите направление"
        w="100%"
        textAlign="left"
        bg="cream"
        border="1px solid"
        borderColor={error ? 'terracotta' : open ? 'terracotta' : 'line'}
        borderRadius="16px"
        px={4}
        py="13px"
        transition="border-color .2s ease, box-shadow .2s ease"
        boxShadow={open ? '0 0 0 1px #C96F4A' : 'none'}
        _hover={{ borderColor: error ? 'terracotta' : 'sage' }}
      >
        <Flex align="center" gap={3}>
          {value === 'surprise' ? (
            <Box
              w="36px"
              h="36px"
              borderRadius="10px"
              bg="sand"
              display="grid"
              placeItems="center"
              flexShrink={0}
              color="terracotta"
            >
              <Icon name="sparkles" size={18} />
            </Box>
          ) : (
            <CountryMark country={selected} size={36} />
          )}
          <Box minW={0} flex="1">
            <Text fontSize="9px" fontWeight={700} letterSpacing="0.17em" textTransform="uppercase" color="muted">
              Куда
            </Text>
            <Text fontSize="15px" fontWeight={700} color="ink" noOfLines={1} mt="2px">
              {value === 'surprise' ? 'Удивите меня' : selected?.name || (loading ? 'Загружаем страны…' : 'Выберите страну')}
            </Text>
          </Box>
          <Icon
            name="chevron-down"
            size={16}
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease', opacity: 0.55 }}
          />
        </Flex>
      </Box>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.16 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              zIndex: 40,
              background: 'var(--cream)',
              border: '1px solid var(--line)',
              borderRadius: 18,
              boxShadow: 'var(--shadow-lift)',
              overflow: 'hidden',
            }}
          >
            <Box p={3} borderBottom="1px solid var(--line)">
              <Flex
                align="center"
                gap={2}
                bg="paper"
                borderRadius="12px"
                px={3}
                border="1px solid transparent"
                _focusWithin={{ borderColor: 'line' }}
              >
                <Icon name="search" size={16} style={{ opacity: 0.5 }} />
                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Город, страна или регион"
                  variant="unstyled"
                  fontSize="14px"
                  py={2.5}
                  aria-label="Поиск направления"
                />
              </Flex>
            </Box>

            <Box maxH="340px" overflowY="auto" className="soft-scrollbar" p={2}>
              <Box
                as="button"
                type="button"
                onClick={() => select('surprise')}
                w="100%"
                textAlign="left"
                px={3}
                py={2.5}
                borderRadius="12px"
                bg={value === 'surprise' ? 'rgba(201,111,74,0.09)' : 'transparent'}
                _hover={{ bg: 'paper' }}
                mb={1}
              >
                <Flex align="center" gap={3}>
                  <Box w="34px" h="34px" borderRadius="10px" bg="ink" color="paper" display="grid" placeItems="center">
                    <Icon name="sparkles" size={17} />
                  </Box>
                  <Box flex="1">
                    <Text fontSize="14px" fontWeight={700}>Удивите меня</Text>
                    <Text fontSize="11px" color="muted">Подберём страну под бюджет и сезон</Text>
                  </Box>
                  {value === 'surprise' && <Icon name="check" size={16} />}
                </Flex>
              </Box>

              {filtered.map((country) => {
                const active = country.id === value
                return (
                  <Box
                    as="button"
                    type="button"
                    key={country.id}
                    onClick={() => select(country.id)}
                    w="100%"
                    textAlign="left"
                    px={3}
                    py={2.5}
                    borderRadius="12px"
                    bg={active ? 'rgba(201,111,74,0.09)' : 'transparent'}
                    _hover={{ bg: 'paper' }}
                  >
                    <Flex align="center" gap={3}>
                      <CountryMark country={country} size={34} />
                      <Box flex="1" minW={0}>
                        <Flex align="baseline" gap={2}>
                          <Text fontSize="14px" fontWeight={700}>{country.name}</Text>
                          <Text fontSize="10px" color="muted">{country.region}</Text>
                        </Flex>
                        <Text fontSize="11px" color="muted" noOfLines={1}>{country.tagline}</Text>
                      </Box>
                      <Box textAlign="right" flexShrink={0}>
                        <Text fontSize="11px" fontWeight={700}>от {formatMoney(country.fromPrice)} ₽</Text>
                        {active && <Icon name="check" size={14} style={{ marginLeft: 'auto' }} />}
                      </Box>
                    </Flex>
                  </Box>
                )
              })}

              {!filtered.length && (
                <Box px={3} py={8} textAlign="center" color="muted" fontSize="13px">
                  Ничего не нашли. Попробуйте «Италия» или «Азия».
                </Box>
              )}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}
