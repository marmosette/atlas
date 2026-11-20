import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import type { DayEvent, DayPlan, Trip } from '../../types'
import { formatMoney } from '../../utils/format'
import { Icon, type IconName } from '../ui/Icon'
import { SectionHeading, SectionShell } from './SectionHeading'

const EventIcon = ({ event }: { event: DayEvent }) => (
  <Icon name={(event.icon as IconName) || 'sparkle'} size={16} />
)

const EventRow = ({ event, isLast }: { event: DayEvent; isLast: boolean }) => (
  <Flex gap={{ base: 3, md: 4 }} position="relative">
    <Box w={{ base: '44px', md: '58px' }} flexShrink={0} pt={1}>
      <Text fontSize="11px" fontWeight={800} color="ink" letterSpacing="-0.01em">{event.time}</Text>
      <Text fontSize="8px" color="muted" mt={0.5} textTransform="uppercase" letterSpacing="0.08em">{event.duration}</Text>
    </Box>

    <Box position="relative" display="flex" flexDirection="column" alignItems="center" flexShrink={0} w="30px">
      <Box
        w="30px"
        h="30px"
        borderRadius="50%"
        bg={event.type === 'food' ? 'rgba(217,164,65,0.18)' : event.type === 'transfer' || event.type === 'arrival' || event.type === 'departure' ? 'rgba(63,110,99,0.14)' : 'rgba(201,111,74,0.12)'}
        color={event.type === 'food' ? '#9A7424' : event.type === 'transfer' || event.type === 'arrival' || event.type === 'departure' ? 'moss' : 'terracottaDark'}
        display="grid"
        placeItems="center"
        border="1px solid"
        borderColor="rgba(22,48,43,0.07)"
        zIndex={1}
        flexShrink={0}
      >
        <EventIcon event={event} />
      </Box>
      {!isLast && <Box w="1px" flex="1" bg="line" my={1} minH="22px" />}
    </Box>

    <Box flex="1" pb={isLast ? 0 : 5} minW={0}>
      <Flex justify="space-between" align="flex-start" gap={3}>
        <Text fontSize="13px" fontWeight={750} lineHeight="1.35">{event.title}</Text>
        {event.cost > 0 && (
          <Text fontSize="10px" fontWeight={700} color="muted" whiteSpace="nowrap" flexShrink={0}>
            ≈ {formatMoney(event.cost)} ₽
          </Text>
        )}
      </Flex>
      <Text fontSize="11px" color="inkSoft" lineHeight="1.6" mt={1}>{event.description}</Text>
      {event.location && (
        <Flex align="center" gap={1} mt={1.5} fontSize="9px" color="muted">
          <Icon name="map-pin" size={10} />
          {event.location}
        </Flex>
      )}
    </Box>
  </Flex>
)

const DayContent = ({ day }: { day: DayPlan }) => (
  <Box>
    <Flex justify="space-between" align="flex-start" gap={4} mb={5} wrap="wrap">
      <Box>
        <Flex align="center" gap={2} mb={2} wrap="wrap">
          <Box bg="ink" color="paper" borderRadius="999px" px={2.5} py={1} fontSize="9px" fontWeight={800} letterSpacing="0.1em" textTransform="uppercase">
            День {day.dayNumber}
          </Box>
          <Text fontSize="10px" color="muted" textTransform="capitalize">{day.weekday}, {day.dateLabel}</Text>
          <Box w="3px" h="3px" borderRadius="50%" bg="muted" opacity={0.4} />
          <Text fontSize="10px" fontWeight={700} color="terracottaDark">{day.cityName}</Text>
        </Flex>
        <Text fontFamily="heading" fontSize={{ base: 'xl', md: '2xl' }} lineHeight="1.15">{day.title}</Text>
        <Text mt={1.5} fontSize="12px" color="inkSoft" maxW="560px" lineHeight="1.6">{day.summary}</Text>
      </Box>
      <Flex gap={2} flexShrink={0} wrap="wrap">
        <Flex align="center" gap={1.5} bg="paper" border="1px solid" borderColor="line" borderRadius="999px" px={2.5} py={1.2} fontSize="10px" fontWeight={600}>
          <Icon name="sun" size={13} />
          {day.weather.high}° / {day.weather.low}°
        </Flex>
        <Flex align="center" gap={1.5} bg="paper" border="1px solid" borderColor="line" borderRadius="999px" px={2.5} py={1.2} fontSize="10px" fontWeight={600}>
          <Icon name="wallet" size={13} />
          {day.dailyBudgetLabel}
        </Flex>
      </Flex>
    </Flex>

    {day.transfer && (
      <Flex
        align="center"
        gap={3}
        bg="rgba(63,110,99,0.08)"
        border="1px solid rgba(63,110,99,0.14)"
        borderRadius="14px"
        px={4}
        py={3}
        mb={5}
      >
        <Icon name="route" size={17} style={{ color: '#3F6E63' }} />
        <Text fontSize="11px" fontWeight={650}>
          Переезд: {day.transfer.from} → {day.transfer.to} · {day.transfer.mode}
        </Text>
      </Flex>
    )}

    <Box>
      {day.events.map((event, index) => (
        <EventRow key={`${event.time}-${event.title}`} event={event} isLast={index === day.events.length - 1} />
      ))}
    </Box>

    <Flex mt={5} pt={4} borderTop="1px solid" borderColor="line" justify="space-between" align="center" gap={3} wrap="wrap">
      <Text fontSize="10px" color="muted">
        Погода: {day.weather.condition} · план можно менять по ходу поездки
      </Text>
      <Text fontSize="11px" fontWeight={800}>
        {day.dailyBudgetLabel}
      </Text>
    </Flex>
  </Box>
)

export const DayPlanSection = ({ trip }: { trip: Trip }) => {
  const [active, setActive] = useState(0)
  const day = trip.days[active]

  return (
    <SectionShell id="days">
      <SectionHeading
        eyebrow="План по дням"
        title="Каждый день — со смыслом"
        description="Время, локации и бюджет дня уже сведены вместе. Переключайте дни, чтобы посмотреть сценарий поездки."
        right={
          <Flex gap={2} flexShrink={0} className="no-print">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActive((current) => Math.max(0, current - 1))}
              isDisabled={active === 0}
              aria-label="Предыдущий день"
            >
              <Icon name="chevron-left" size={16} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActive((current) => Math.min(trip.days.length - 1, current + 1))}
              isDisabled={active === trip.days.length - 1}
              aria-label="Следующий день"
            >
              <Icon name="chevron-right" size={16} />
            </Button>
          </Flex>
        }
      />

      <Box
        display="flex"
        gap={2}
        overflowX="auto"
        pb={2}
        mb={5}
        className="hide-scrollbar"
        role="tablist"
        aria-label="Дни поездки"
      >
        {trip.days.map((item, index) => {
          const selected = index === active
          return (
            <Box
              as="button"
              key={item.date}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(index)}
              flexShrink={0}
              textAlign="left"
              minW="118px"
              px={3.5}
              py={3}
              borderRadius="16px"
              border="1px solid"
              borderColor={selected ? 'ink' : 'line'}
              bg={selected ? 'ink' : 'cream'}
              color={selected ? 'paper' : 'ink'}
              transition="all .22s ease"
              _hover={{ borderColor: selected ? 'ink' : 'terracotta' }}
            >
              <Flex justify="space-between" align="center" gap={2}>
                <Text fontSize="9px" fontWeight={800} letterSpacing="0.12em" textTransform="uppercase" opacity={selected ? 0.6 : 0.5}>
                  День {item.dayNumber}
                </Text>
                <Text fontSize="9px" opacity={selected ? 0.6 : 0.5}>{item.dateLabel}</Text>
              </Flex>
              <Text fontSize="12px" fontWeight={700} mt={1.5} noOfLines={1}>{item.cityName}</Text>
            </Box>
          )
        })}
      </Box>

      <Box
        bg="cream"
        border="1px solid"
        borderColor="line"
        borderRadius={{ base: '22px', md: '26px' }}
        p={{ base: 5, md: 7 }}
        boxShadow="var(--shadow-soft)"
        minH="420px"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <DayContent day={day} />
          </motion.div>
        </AnimatePresence>
      </Box>
    </SectionShell>
  )
}
