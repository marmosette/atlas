import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import { useEffect, useMemo, useRef, useState } from 'react'

import { formatDateRange, formatDate, getDuration, monthName, parseLocalIso, toLocalIso } from '../../utils/format'
import { Icon } from '../ui/Icon'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (range: { startDate: string; endDate: string }) => void
  error?: string
  startError?: string
  endError?: string
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export const DateRangePicker = ({ startDate, endDate, onChange, error }: DateRangePickerProps) => {
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [draftStart, setDraftStart] = useState<Date | null>(null)
  const [draftEnd, setDraftEnd] = useState<Date | null>(null)
  const [hovered, setHovered] = useState<Date | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  const today = useMemo(() => startOfDay(new Date()), [])
  const maxDate = useMemo(() => addMonths(today, 24), [today])

  const syncFromProps = () => {
    const start = parseLocalIso(startDate)
    const end = parseLocalIso(endDate)
    setDraftStart(start)
    setDraftEnd(end)
    setMonth(startOfMonth(start || today))
  }

  useEffect(() => {
    if (!open) {
      setHovered(null)
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
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (open) syncFromProps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const gridEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    const result: Date[] = []
    let cursor = gridStart
    while (cursor <= gridEnd) {
      result.push(cursor)
      cursor = addDays(cursor, 1)
    }
    return result
  }, [month])

  const commit = (start: Date, end: Date) => {
    onChange({ startDate: toLocalIso(start), endDate: toLocalIso(end) })
    window.setTimeout(() => setOpen(false), 180)
  }

  const handleSelect = (day: Date) => {
    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(day)
      setDraftEnd(null)
      return
    }
    if (isBefore(day, draftStart)) {
      setDraftStart(day)
      setDraftEnd(null)
      return
    }
    if (isSameDay(day, draftStart)) {
      const next = addDays(day, 1)
      setDraftEnd(next)
      commit(day, next)
      return
    }
    setDraftEnd(day)
    commit(draftStart, day)
  }

  const previewEnd = draftEnd || (draftStart && hovered && isAfter(hovered, draftStart) ? hovered : null)
  const duration = draftStart && draftEnd ? getDuration(toLocalIso(draftStart), toLocalIso(draftEnd)) : 0

  const preset = (offset: number, length: number) => {
    const start = addDays(today, offset)
    const end = addDays(start, length - 1)
    setDraftStart(start)
    setDraftEnd(end)
    setMonth(startOfMonth(start))
    commit(start, end)
  }

  return (
    <Box ref={rootRef} position="relative" w="100%">
      <Box
        as="button"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Выберите даты поездки"
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
          <Box w="36px" h="36px" borderRadius="10px" bg="sand" color="ink" display="grid" placeItems="center" flexShrink={0}>
            <Icon name="calendar" size={18} />
          </Box>
          <Box minW={0} flex="1">
            <Text fontSize="9px" fontWeight={700} letterSpacing="0.17em" textTransform="uppercase" color="muted">
              Когда
            </Text>
            <Text fontSize="15px" fontWeight={700} color="ink" noOfLines={1} mt="2px">
              {startDate && endDate ? formatDateRange(startDate, endDate) : startDate ? `${formatDate(startDate)} — выберите возвращение` : 'Выберите даты'}
            </Text>
          </Box>
          {startDate && endDate && (
            <Box bg="sand" borderRadius="999px" px={2.5} py={1} fontSize="10px" fontWeight={700} whiteSpace="nowrap">
              {getDuration(startDate, endDate)} дн.
            </Box>
          )}
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
              zIndex: 40,
              width: 'min(360px, calc(100vw - 48px))',
              background: 'var(--cream)',
              border: '1px solid var(--line)',
              borderRadius: 20,
              boxShadow: 'var(--shadow-lift)',
              overflow: 'hidden',
            }}
          >
            <Flex align="center" justify="space-between" px={4} pt={4} pb={2}>
              <Box
                as="button"
                type="button"
                aria-label="Предыдущий месяц"
                onClick={() => setMonth((current) => (isAfter(current, startOfMonth(today)) ? subMonths(current, 1) : current))}
                w="34px"
                h="34px"
                borderRadius="50%"
                display="grid"
                placeItems="center"
                _hover={{ bg: 'paper' }}
                opacity={isAfter(startOfMonth(month), startOfMonth(today)) ? 1 : 0.3}
              >
                <Icon name="chevron-left" size={18} />
              </Box>
              <Box textAlign="center">
                <Text fontFamily="heading" fontSize="18px">{monthName(month.getMonth())} {month.getFullYear()}</Text>
                <Text fontSize="9px" color="muted" letterSpacing="0.12em" textTransform="uppercase">Выберите дни</Text>
              </Box>
              <Box
                as="button"
                type="button"
                aria-label="Следующий месяц"
                onClick={() => setMonth((current) => (isBefore(endOfMonth(current), maxDate) ? addMonths(current, 1) : current))}
                w="34px"
                h="34px"
                borderRadius="50%"
                display="grid"
                placeItems="center"
                _hover={{ bg: 'paper' }}
                opacity={isBefore(endOfMonth(month), maxDate) ? 1 : 0.3}
              >
                <Icon name="chevron-right" size={18} />
              </Box>
            </Flex>

            <Box px={4} pb={3}>
              <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mb={1}>
                {WEEKDAYS.map((day) => (
                  <Text key={day} textAlign="center" fontSize="9px" fontWeight={700} color="muted" letterSpacing="0.08em" py={1}>
                    {day}
                  </Text>
                ))}
              </Box>
              <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" rowGap="2px" onMouseLeave={() => setHovered(null)}>
                {days.map((day) => {
                  const beforeToday = isBefore(day, today)
                  const afterMax = isAfter(day, maxDate)
                  const outside = !isSameMonth(day, month)
                  const isStart = Boolean(draftStart && isSameDay(day, draftStart))
                  const isEnd = Boolean(previewEnd && isSameDay(day, previewEnd))
                  const inRange = Boolean(
                    draftStart && previewEnd && isAfter(day, draftStart) && isBefore(day, previewEnd)
                  )
                  const disabled = beforeToday || afterMax
                  return (
                    <Box
                      key={day.toISOString()}
                      position="relative"
                      h="38px"
                      bg={inRange ? 'rgba(201,111,74,0.13)' : 'transparent'}
                      borderTopLeftRadius={isStart ? '999px' : 0}
                      borderBottomLeftRadius={isStart ? '999px' : 0}
                      borderTopRightRadius={isEnd ? '999px' : 0}
                      borderBottomRightRadius={isEnd ? '999px' : 0}
                    >
                      <Box
                        as="button"
                        type="button"
                        disabled={disabled}
                        onClick={() => handleSelect(day)}
                        onMouseEnter={() => setHovered(day)}
                        aria-label={format(day, 'd MMMM yyyy', { locale: ru })}
                        aria-pressed={isStart || isEnd}
                        w="100%"
                        h="100%"
                        borderRadius="999px"
                        fontSize="12px"
                        fontWeight={isStart || isEnd ? 800 : 500}
                        color={isStart || isEnd ? 'paper' : disabled ? 'rgba(108,122,114,0.35)' : outside ? 'rgba(108,122,114,0.5)' : 'ink'}
                        bg={isStart || isEnd ? 'terracotta' : 'transparent'}
                        _hover={!disabled && !isStart && !isEnd ? { bg: 'paper' } : undefined}
                        transition="background .15s ease, color .15s ease"
                      >
                        {day.getDate()}
                      </Box>
                    </Box>
                  )
                })}
              </Box>
            </Box>

            <Box borderTop="1px solid var(--line)" px={4} py={3}>
              <Flex gap={2} mb={3} flexWrap="wrap">
                <Box as="button" type="button" fontSize="11px" fontWeight={600} px={2.5} py={1.5} borderRadius="999px" bg="paper" _hover={{ bg: 'sand' }} onClick={() => preset(30, 7)}>
                  Неделя
                </Box>
                <Box as="button" type="button" fontSize="11px" fontWeight={600} px={2.5} py={1.5} borderRadius="999px" bg="paper" _hover={{ bg: 'sand' }} onClick={() => preset(30, 10)}>
                  10 дней
                </Box>
                <Box as="button" type="button" fontSize="11px" fontWeight={600} px={2.5} py={1.5} borderRadius="999px" bg="paper" _hover={{ bg: 'sand' }} onClick={() => preset(45, 14)}>
                  2 недели
                </Box>
              </Flex>
              <Flex justify="space-between" align="center" gap={3}>
                <Text fontSize="11px" color="muted">
                  {duration ? `${duration} ${duration === 1 ? 'день' : duration < 5 ? 'дня' : 'дней'} · ${duration - 1} ноч.` : 'Минимум 2 дня'}
                </Text>
                <Button size="sm" variant="solid" onClick={() => setOpen(false)} isDisabled={!draftStart || !draftEnd}>
                  Готово
                </Button>
              </Flex>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}
