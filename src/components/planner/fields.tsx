import { Box, Flex, Input, Text } from '@chakra-ui/react'
import { type ReactNode, useState } from 'react'

import type { Pace } from '../../types'
import { BUDGET_PRESETS, INTERESTS, PACE_OPTIONS, clamp, formatMoney, plural } from '../../utils/format'
import { Icon, type IconName } from '../ui/Icon'

export const FieldLabel = ({ children, hint }: { children: ReactNode; hint?: string }) => (
  <Flex align="baseline" justify="space-between" gap={3} mb={2}>
    <Text fontSize="9px" fontWeight={800} letterSpacing="0.18em" textTransform="uppercase" color="muted">
      {children}
    </Text>
    {hint && <Text fontSize="10px" color="muted">{hint}</Text>}
  </Flex>
)

export const ErrorText = ({ children }: { children?: ReactNode }) =>
  children ? (
    <Text mt={1.5} fontSize="11px" color="terracottaDark" fontWeight={600}>
      {children}
    </Text>
  ) : null

interface BudgetFieldProps {
  value: number
  onChange: (value: number) => void
  travelers: number
  error?: string
}

export const BudgetField = ({ value, onChange, travelers, error }: BudgetFieldProps) => {
  const [focused, setFocused] = useState(false)
  const display = focused ? (value ? String(value) : '') : formatMoney(value)

  return (
    <Box>
      <FieldLabel hint={`${formatMoney(value / Math.max(travelers, 1))} ₽ / чел.`}>Бюджет</FieldLabel>
      <Flex
        align="center"
        bg="cream"
        border="1px solid"
        borderColor={error ? 'terracotta' : focused ? 'terracotta' : 'line'}
        borderRadius="16px"
        px={4}
        py="9px"
        transition="border-color .2s ease, box-shadow .2s ease"
        boxShadow={focused ? '0 0 0 1px #C96F4A' : 'none'}
        _hover={{ borderColor: error ? 'terracotta' : 'sage' }}
      >
        <Box w="36px" h="36px" borderRadius="10px" bg="sand" display="grid" placeItems="center" flexShrink={0} mr={3}>
          <Icon name="wallet" size={18} />
        </Box>
        <Input
          value={display}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, '').slice(0, 7)
            onChange(Number(digits) || 0)
          }}
          inputMode="numeric"
          aria-label="Бюджет поездки в рублях"
          variant="unstyled"
          fontSize="17px"
          fontWeight={800}
          letterSpacing="-0.01em"
          flex="1"
          minW={0}
        />
        <Text fontSize="16px" fontWeight={700} color="muted" ml={1}>₽</Text>
      </Flex>
      <Flex gap={1.5} mt={2.5} flexWrap="wrap">
        {BUDGET_PRESETS.map((preset) => {
          const active = value === preset
          return (
            <Box
              as="button"
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              px={2.5}
              py={1}
              borderRadius="999px"
              bg={active ? 'ink' : 'transparent'}
              color={active ? 'paper' : 'muted'}
              border="1px solid"
              borderColor={active ? 'ink' : 'line'}
              fontSize="10px"
              fontWeight={600}
              transition="all .2s ease"
              _hover={{ borderColor: 'ink', color: active ? 'paper' : 'ink' }}
            >
              {formatMoney(preset)}
            </Box>
          )
        })}
      </Flex>
      <ErrorText>{error}</ErrorText>
    </Box>
  )
}

interface TravelersFieldProps {
  value: number
  onChange: (value: number) => void
  error?: string
}

export const TravelersField = ({ value, onChange, error }: TravelersFieldProps) => (
  <Box>
    <FieldLabel hint="до 8">Путешественники</FieldLabel>
    <Flex
      align="center"
      bg="cream"
      border="1px solid"
      borderColor={error ? 'terracotta' : 'line'}
      borderRadius="16px"
      px={2.5}
      py="9px"
    >
      <Box
        as="button"
        type="button"
        aria-label="Убрать путешественника"
        onClick={() => onChange(clamp(value - 1, 1, 8))}
        w="34px"
        h="34px"
        borderRadius="50%"
        display="grid"
        placeItems="center"
        border="1px solid"
        borderColor="line"
        color="ink"
        bg="transparent"
        _hover={{ bg: 'paper' }}
        transition="background .2s ease"
        flexShrink={0}
      >
        <Icon name="minus" size={15} />
      </Box>
      <Flex flex="1" direction="column" align="center" justify="center" minW={0} px={1}>
        <Text fontSize="17px" fontWeight={800} lineHeight="1.1">{value}</Text>
        <Text fontSize="9px" color="muted" whiteSpace="nowrap">
          {plural(value, 'человек', 'человека', 'человек')}
        </Text>
      </Flex>
      <Box
        as="button"
        type="button"
        aria-label="Добавить путешественника"
        onClick={() => onChange(clamp(value + 1, 1, 8))}
        w="34px"
        h="34px"
        borderRadius="50%"
        display="grid"
        placeItems="center"
        border="1px solid"
        borderColor="line"
        color="ink"
        bg="transparent"
        _hover={{ bg: 'paper' }}
        transition="background .2s ease"
        flexShrink={0}
      >
        <Icon name="plus" size={15} />
      </Box>
    </Flex>
    <ErrorText>{error}</ErrorText>
  </Box>
)

interface PaceSelectorProps {
  value: Pace
  onChange: (value: Pace) => void
}

export const PaceSelector = ({ value, onChange }: PaceSelectorProps) => (
  <Box>
    <FieldLabel hint="ваш ритм">Темп</FieldLabel>
    <Box display="grid" gridTemplateColumns="repeat(3, minmax(0, 1fr))" gap={1.5}>
      {PACE_OPTIONS.map((option) => {
        const active = value === option.id
        return (
          <Box
            as="button"
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            textAlign="left"
            px={2.5}
            py={2}
            minH="60px"
            minW={0}
            borderRadius="14px"
            border="1px solid"
            borderColor={active ? 'ink' : 'line'}
            bg={active ? 'ink' : 'cream'}
            color={active ? 'paper' : 'ink'}
            transition="all .2s ease"
            _hover={{ borderColor: 'ink' }}
          >
            <Text fontSize="10px" fontWeight={800} lineHeight="1.2">{option.label}</Text>
            <Text fontSize="9px" mt={1} opacity={active ? 0.65 : 0.55} lineHeight="1.25">
              {option.description}
            </Text>
          </Box>
        )
      })}
    </Box>
  </Box>
)

interface InterestChipsProps {
  values: string[]
  onToggle: (value: string) => void
}

export const InterestChips = ({ values, onToggle }: InterestChipsProps) => (
  <Box>
    <FieldLabel hint={`${values.length}/5`}>Что любите</FieldLabel>
    <Flex gap={2} flexWrap="wrap">
      {INTERESTS.map((interest) => {
        const active = values.includes(interest.id)
        return (
          <Box
            as="button"
            key={interest.id}
            type="button"
            onClick={() => onToggle(interest.id)}
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={3}
            py={2}
            borderRadius="999px"
            border="1px solid"
            borderColor={active ? 'terracotta' : 'line'}
            bg={active ? 'rgba(201,111,74,0.1)' : 'cream'}
            color={active ? 'terracottaDark' : 'inkSoft'}
            fontSize="12px"
            fontWeight={600}
            transition="all .2s ease"
            _hover={{ borderColor: 'terracotta', transform: 'translateY(-1px)' }}
          >
            <Icon name={interest.icon as IconName} size={15} />
            {interest.id}
          </Box>
        )
      })}
    </Flex>
  </Box>
)
