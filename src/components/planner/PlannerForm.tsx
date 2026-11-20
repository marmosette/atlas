import { Box, Button, Flex, Text, Textarea, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { CountryOption } from '../../types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { generateTrip } from '../../store/generationSlice'
import { plannerActions } from '../../store/plannerSlice'
import { formatDateRange, formatMoney, getDuration } from '../../utils/format'
import { validateDraft } from '../../utils/validation'
import { Icon } from '../ui/Icon'
import { BudgetField, ErrorText, FieldLabel, InterestChips, PaceSelector, TravelersField } from './fields'
import { CountrySelect } from './CountrySelect'
import { DateRangePicker } from './DateRangePicker'

interface PlannerFormProps {
  countries: CountryOption[]
  loading?: boolean
}

export const PlannerForm = ({ countries, loading }: PlannerFormProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const draft = useAppSelector((state) => state.planner.draft)
  const status = useAppSelector((state) => state.generation.status)
  const [submitted, setSubmitted] = useState(false)

  const errors = submitted ? validateDraft(draft) : {}
  const isSubmitting = status === 'loading'
  const duration = getDuration(draft.startDate, draft.endDate)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    const nextErrors = validateDraft(draft)
    if (Object.keys(nextErrors).length) {
      const firstField = Object.keys(nextErrors)[0]
      const element = document.querySelector(`[data-field="${firstField}"]`)
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      toast({
        title: 'Проверьте детали поездки',
        description: Object.values(nextErrors)[0],
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return
    }

    try {
      const trip = await dispatch(generateTrip()).unwrap()
      navigate(`/trip/${trip.id}`)
    } catch (error) {
      toast({
        title: 'Не удалось собрать маршрут',
        description: typeof error === 'string' ? error : 'Попробуйте ещё раз через минуту.',
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }
  }

  return (
    <Box
      as="form"
      id="planner"
      onSubmit={handleSubmit}
      bg="cream"
      border="1px solid"
      borderColor="line"
      borderRadius={{ base: '24px', md: '30px' }}
      boxShadow="var(--shadow-lift)"
      p={{ base: 5, sm: 7, lg: 9 }}
      position="relative"
      scrollMarginTop="96px"
    >
      <Box
        position="absolute"
        top={{ base: 5, md: 8 }}
        right={{ base: 5, md: 8 }}
        display="inline-flex"
        alignItems="center"
        gap={1.5}
        bg="rgba(201,111,74,0.1)"
        color="terracottaDark"
        borderRadius="999px"
        px={2.5}
        py={1}
        fontSize="9px"
        fontWeight={800}
        letterSpacing="0.1em"
        textTransform="uppercase"
      >
        <Icon name="sparkles" size={12} />
        GigaChat
      </Box>

      <Flex justify="space-between" align="flex-start" gap={4} mb={{ base: 6, md: 7 }} pr={{ base: 0, sm: 20 }}>
        <Box>
          <Text fontSize="10px" fontWeight={800} letterSpacing="0.18em" textTransform="uppercase" color="muted" mb={2}>
            Конструктор поездки
          </Text>
          <Text fontFamily="heading" fontSize={{ base: '2xl', sm: '3xl' }} lineHeight="1.1" letterSpacing="-0.02em">
            Расскажите, куда и когда
          </Text>
        </Box>
      </Flex>

      <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }} gap={{ base: 4, md: 4.5 }}>
        <Box gridColumn={{ base: 'span 1', md: 'span 7' }} data-field="country">
          <CountrySelect
            countries={countries}
            value={draft.country}
            onChange={(value) => dispatch(plannerActions.setCountry(value))}
            error={errors.country}
            loading={loading}
          />
          <ErrorText>{errors.country}</ErrorText>
        </Box>

        <Box gridColumn={{ base: 'span 1', md: 'span 5' }} data-field="startDate">
          <DateRangePicker
            startDate={draft.startDate}
            endDate={draft.endDate}
            onChange={({ startDate, endDate }) => dispatch(plannerActions.setDates({ startDate, endDate }))}
            error={errors.startDate || errors.endDate}
          />
          <ErrorText>{errors.startDate || errors.endDate}</ErrorText>
        </Box>

        <Box gridColumn={{ base: 'span 1', md: 'span 4' }} data-field="budget">
          <BudgetField
            value={draft.budget}
            onChange={(value) => dispatch(plannerActions.setBudget(value))}
            travelers={draft.travelers}
            error={errors.budget}
          />
        </Box>

        <Box gridColumn={{ base: 'span 1', md: 'span 4' }} data-field="travelers">
          <TravelersField
            value={draft.travelers}
            onChange={(value) => dispatch(plannerActions.setTravelers(value))}
            error={errors.travelers}
          />
        </Box>

        <Box gridColumn={{ base: 'span 1', md: 'span 4' }}>
          <PaceSelector value={draft.pace} onChange={(value) => dispatch(plannerActions.setPace(value))} />
        </Box>

        <Box gridColumn={{ base: 'span 1', md: 'span 12' }} mt={1}>
          <InterestChips
            values={draft.interests}
            onToggle={(value) => dispatch(plannerActions.toggleInterest(value))}
          />
        </Box>

        <Box gridColumn={{ base: 'span 1', md: 'span 12' }} mt={1}>
          <FieldLabel hint="необязательно">Пожелания к маршруту</FieldLabel>
          <Textarea
            value={draft.notes}
            onChange={(event) => dispatch(plannerActions.setNotes(event.target.value))}
            placeholder="Например: без музеев, больше природы, хочу поезд вместо самолёта и один день без плана"
            rows={2}
            resize="none"
            bg="cream"
            borderColor="line"
            borderRadius="14px"
            fontSize="13px"
            px={3.5}
            py={2.5}
            _hover={{ borderColor: 'sage' }}
            _focusVisible={{ borderColor: 'terracotta', boxShadow: '0 0 0 1px #C96F4A' }}
            maxLength={500}
          />
        </Box>
      </Box>

      <Flex
        mt={{ base: 6, md: 7 }}
        pt={{ base: 5, md: 6 }}
        borderTop="1px solid"
        borderColor="line"
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        justify="space-between"
        gap={4}
      >
        <Box order={{ base: 2, md: 1 }}>
          <Flex align="center" gap={2} fontSize="12px" color="inkSoft" fontWeight={600}>
            <Icon name="shield" size={15} />
            Бесплатно · без регистрации
          </Flex>
          <Text mt={1} fontSize="11px" color="muted">
            {draft.startDate && draft.endDate
              ? `${formatDateRange(draft.startDate, draft.endDate)} · ${duration} дн. · ${formatMoney(draft.budget)} ₽`
              : 'Укажите даты и бюджет — остальное соберём мы'}
          </Text>
        </Box>
        <Button
          type="submit"
          size="lg"
          variant="accent"
          isLoading={isSubmitting}
          loadingText="Собираем маршрут"
          height="58px"
          px={{ base: 6, md: 8 }}
          fontSize="15px"
          order={{ base: 1, md: 2 }}
          flexShrink={0}
          rightIcon={<Icon name="arrow-right" size={18} />}
          _hover={{ transform: 'translateY(-2px)', boxShadow: '0 14px 30px rgba(201,111,74,0.28)' }}
        >
          Собрать маршрут
        </Button>
      </Flex>
    </Box>
  )
}
