import { Box, Button, Flex, IconButton, Text, useToast } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'

import type { Trip } from '../../types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { generateTrip } from '../../store/generationSlice'
import { DestinationArt } from '../art/DestinationArt'
import { CountryMark } from '../planner/CountrySelect'
import { Icon } from '../ui/Icon'

const MetaChip = ({ icon, label }: { icon: 'calendar' | 'users' | 'wallet' | 'route'; label: string }) => (
  <Flex
    align="center"
    gap={2}
    border="1px solid"
    borderColor="line"
    bg="rgba(252,249,242,0.6)"
    borderRadius="999px"
    px={3}
    py={1.5}
    fontSize="11px"
    fontWeight={650}
    color="inkSoft"
    whiteSpace="nowrap"
  >
    <Icon name={icon} size={14} />
    {label}
  </Flex>
)

export const TripHero = ({ trip }: { trip: Trip }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const status = useAppSelector((state) => state.generation.status)

  const regenerate = async () => {
    try {
      const next = await dispatch(generateTrip(trip.request)).unwrap()
      navigate(`/trip/${next.id}`)
      toast({
        title: 'Маршрут пересобран',
        description: 'Мы заново подобрали города, отели и распределение бюджета.',
        status: 'success',
        duration: 3500,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Не удалось пересобрать маршрут',
        description: typeof error === 'string' ? error : 'Попробуйте ещё раз.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({ title: 'Ссылка скопирована', status: 'success', duration: 2500 })
    } catch {
      toast({ title: 'Не удалось скопировать ссылку', status: 'warning', duration: 3000 })
    }
  }

  const sourceLabel = trip.meta.source === 'gigachat' ? 'GigaChat' : 'Atlas AI'
  const sourceNote = trip.meta.source === 'gigachat' ? trip.meta.model : 'демо-движок'

  return (
    <Box className="atlas-container" pt={{ base: 5, md: 8 }}>
      <Flex justify="space-between" align="center" gap={4} className="no-print">
        <Link to="/trips" className="link-underline" style={{ fontSize: 12, color: 'var(--muted)' }}>
          <Icon name="arrow-left" size={14} />
          Мои поездки
        </Link>
        <Flex gap={2}>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Icon name="refresh" size={15} />}
            onClick={regenerate}
            isLoading={status === 'loading'}
            loadingText="Пересобираем"
          >
            <Box as="span" display={{ base: 'none', sm: 'inline' }}>Пересобрать</Box>
          </Button>
          <IconButton
            aria-label="Скопировать ссылку"
            size="sm"
            variant="outline"
            icon={<Icon name="share" size={15} />}
            onClick={share}
          />
          <IconButton
            aria-label="Распечатать маршрут"
            size="sm"
            variant="outline"
            icon={<Icon name="print" size={15} />}
            onClick={() => window.print()}
          />
        </Flex>
      </Flex>

      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        mt={{ base: 8, md: 10 }}
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '1.35fr 0.9fr' }}
        gap={{ base: 8, lg: 10 }}
        alignItems="center"
      >
        <Box>
          <Flex align="center" gap={2.5} mb={4} flexWrap="wrap">
            <Box className="eyebrow" mb={0}>{trip.country.region}</Box>
            <Box w="3px" h="3px" borderRadius="50%" bg="muted" opacity={0.5} />
            <Text fontSize="10px" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase" color="muted">
              {trip.dates.label}
            </Text>
          </Flex>
          <Text as="h1" className="display-title" fontSize={{ base: '4xl', sm: '5xl', lg: '56px' }} maxW="720px">
            {trip.title}
          </Text>
          <Text mt={4} fontFamily="heading" fontSize={{ base: 'lg', md: 'xl' }} color="terracottaDark" maxW="600px">
            {trip.subtitle}
          </Text>
          <Text mt={5} color="inkSoft" fontSize="14px" lineHeight="1.75" maxW="620px">
            {trip.summary}
          </Text>

          <Flex mt={6} gap={2} flexWrap="wrap">
            <MetaChip icon="calendar" label={`${trip.stats.daysLabel} · ${trip.stats.nights} ночей`} />
            <MetaChip icon="route" label={`${trip.stats.citiesLabel} · ${trip.stats.travelers} чел.`} />
            <MetaChip icon="wallet" label={`${trip.stats.budgetLabel} · ${trip.stats.perPersonLabel}`} />
          </Flex>
        </Box>

        <Box position="relative" maxW={{ base: '100%', lg: '440px' }} justifySelf={{ base: 'stretch', lg: 'end' }} w="100%">
          <Box
            borderRadius={{ base: '24px', md: '30px' }}
            overflow="hidden"
            border="6px solid #FCF9F2"
            boxShadow="var(--shadow-lift)"
            position="relative"
            transform={{ base: 'none', lg: 'rotate(1.5deg)' }}
          >
            <Box aspectRatio="4 / 3.25" position="relative">
              <DestinationArt scene={trip.country.scene} palette={trip.country.palette} variant="hero" />
              <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(22,48,43,0.06) 30%, rgba(22,48,43,0.76) 100%)" />
              <Flex position="absolute" top={4} left={4} right={4} justify="space-between" align="center">
                <Flex
                  align="center"
                  gap={1.5}
                  bg="rgba(252,249,242,0.92)"
                  backdropFilter="blur(8px)"
                  px={2.5}
                  py={1.4}
                  borderRadius="999px"
                  fontSize="9px"
                  fontWeight={800}
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  <Icon name="sparkles" size={12} />
                  {sourceLabel}
                </Flex>
                <CountryMark country={{ id: trip.country.id, palette: trip.country.palette }} size={36} />
              </Flex>
              <Box position="absolute" left={5} right={5} bottom={5} color="#FCF9F2">
                <Text fontSize="9px" fontWeight={800} letterSpacing="0.16em" textTransform="uppercase" opacity={0.7} mb={2}>
                  {sourceNote}
                </Text>
                <Text fontFamily="heading" fontSize="3xl" lineHeight="1.05">{trip.country.name}</Text>
                <Text fontSize="11px" opacity={0.75} mt={1.5}>
                  {trip.cities.map((city) => city.name).join(' · ')}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box
            position="absolute"
            left={-10}
            bottom={-18}
            bg="cream"
            border="1px solid var(--line)"
            borderRadius="14px"
            boxShadow="var(--shadow-card)"
            px={3.5}
            py={2.5}
            transform="rotate(-3deg)"
          >
            <Flex align="center" gap={2}>
              <Icon name="sparkles" size={14} style={{ color: '#C96F4A' }} />
              <Text fontSize="10px" fontWeight={700}>
                {trip.meta.source === 'gigachat' ? 'Собрано GigaChat' : 'Демо-маршрут · Atlas Engine'}
              </Text>
            </Flex>
          </Box>
        </Box>
      </Box>

      <Box
        mt={{ base: 9, md: 12 }}
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="line"
        py={{ base: 5, md: 6 }}
        display="grid"
        gridTemplateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
        rowGap={6}
      >
        {[
          { label: 'Даты', value: trip.dates.label, note: `${trip.stats.daysLabel} · ${trip.stats.nights} ночей` },
          { label: 'Маршрут', value: trip.stats.citiesLabel, note: trip.cities.map((city) => city.name).join(' → ') },
          { label: 'Компания', value: `${trip.stats.travelers} ${trip.stats.travelers === 1 ? 'путешественник' : 'путешественника'}`, note: `${trip.budget.rooms} ${trip.budget.rooms === 1 ? 'номер' : 'номера'}` },
          { label: 'Бюджет', value: trip.stats.budgetLabel, note: `${trip.stats.perPersonLabel} · ${trip.budget.dailyLabel}` },
        ].map((stat, index) => (
          <Box
            key={stat.label}
            px={{ base: 0, md: index === 0 ? 0 : 6 }}
            borderLeft={{ base: 'none', md: index === 0 ? 'none' : '1px solid' }}
            borderColor="line"
          >
            <Text fontSize="9px" fontWeight={800} letterSpacing="0.16em" textTransform="uppercase" color="muted" mb={2}>
              {stat.label}
            </Text>
            <Text fontFamily="heading" fontSize={{ base: 'lg', md: 'xl' }} lineHeight="1.2">{stat.value}</Text>
            <Text mt={1.5} fontSize="10px" color="muted" noOfLines={1}>{stat.note}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
