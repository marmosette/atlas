import { Box, Button, Flex, IconButton, SimpleGrid, Text, useToast } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { DestinationArt } from '../components/art/DestinationArt'
import { Icon } from '../components/ui/Icon'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { tripsActions } from '../store/tripsSlice'
import type { Trip } from '../types'
import { timeAgo } from '../utils/format'

const TripCard = ({ trip, onDelete }: { trip: Trip; onDelete: (trip: Trip) => void }) => (
  <Box
    as={motion.article}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    position="relative"
    bg="cream"
    border="1px solid"
    borderColor="line"
    borderRadius="22px"
    overflow="hidden"
    transition="box-shadow .3s ease, border-color .3s ease"
    _hover={{ boxShadow: 'var(--shadow-card)', borderColor: 'rgba(201,111,74,0.4)' }}
  >
    <Link to={`/trip/${trip.id}`} style={{ display: 'block' }}>
      <Box position="relative" aspectRatio="16 / 9" overflow="hidden">
        <DestinationArt scene={trip.country.scene} palette={trip.country.palette} />
        <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(22,48,43,0.02) 40%, rgba(22,48,43,0.62) 100%)" />
        <Flex position="absolute" top={3} left={3} right={3} justify="space-between" align="center">
          <Box bg="rgba(252,249,242,0.9)" backdropFilter="blur(8px)" borderRadius="999px" px={2.5} py={1} fontSize="9px" fontWeight={800} letterSpacing="0.1em">
            {trip.country.region}
          </Box>
          <Box bg="rgba(252,249,242,0.9)" backdropFilter="blur(8px)" borderRadius="999px" px={2.5} py={1} fontSize="9px" fontWeight={700}>
            {trip.stats.daysLabel}
          </Box>
        </Flex>
        <Box position="absolute" left={4} right={4} bottom={3.5} color="white">
          <Text fontSize="9px" fontWeight={700} letterSpacing="0.12em" textTransform="uppercase" opacity={0.72} mb={1}>
            {trip.dates.label}
          </Text>
          <Text fontFamily="heading" fontSize="xl" lineHeight="1.12" noOfLines={2}>{trip.title}</Text>
        </Box>
      </Box>

      <Box p={4.5}>
        <Flex justify="space-between" align="center" gap={3}>
          <Flex gap={2} wrap="wrap">
            <Box bg="paper" border="1px solid" borderColor="line" borderRadius="999px" px={2} py={0.8} fontSize="9px" fontWeight={700}>
              {trip.stats.budgetLabel}
            </Box>
            <Box bg="paper" border="1px solid" borderColor="line" borderRadius="999px" px={2} py={0.8} fontSize="9px" fontWeight={700}>
              {trip.stats.citiesLabel}
            </Box>
          </Flex>
          <Text fontSize="9px" color="muted">{timeAgo(trip.createdAt)}</Text>
        </Flex>
        <Flex justify="space-between" align="center" gap={2} mt={3}>
          <Text fontSize="11px" color="muted" noOfLines={1}>{trip.cities.map((city) => city.name).join(' → ')}</Text>
          <Icon name="arrow-up-right" size={15} style={{ flexShrink: 0, opacity: 0.55 }} />
        </Flex>
      </Box>
    </Link>

    <IconButton
      aria-label="Удалить маршрут"
      icon={<Icon name="trash" size={14} />}
      size="xs"
      variant="ghost"
      position="absolute"
      top={3}
      right={3}
      bg="rgba(252,249,242,0.88)"
      backdropFilter="blur(6px)"
      color="inkSoft"
      _hover={{ bg: '#F3DED4', color: 'terracottaDark' }}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onDelete(trip)
      }}
      zIndex={2}
    />
  </Box>
)

export const TripsPage = () => {
  const trips = useAppSelector((state) => state.trips.items)
  const dispatch = useAppDispatch()
  const toast = useToast()

  const remove = (trip: Trip) => {
    if (!window.confirm(`Удалить маршрут «${trip.title}»?`)) return
    dispatch(tripsActions.removeTrip(trip.id))
    toast({
      title: 'Маршрут удалён',
      description: 'Его всегда можно собрать заново.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box className="atlas-container" pt={{ base: 10, md: 14 }} pb={{ base: 10, md: 14 }}>
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'flex-end' }} gap={5} direction={{ base: 'column', md: 'row' }}>
        <Box>
          <Box className="eyebrow" mb={4}>Личный архив</Box>
          <Text as="h1" className="display-title" fontSize={{ base: '4xl', md: '5xl' }}>Мои поездки</Text>
          <Text mt={3} color="inkSoft" fontSize="14px" maxW="500px">
            {trips.length
              ? `${trips.length} ${trips.length === 1 ? 'маршрут' : trips.length < 5 ? 'маршрута' : 'маршрутов'} сохранено в этом браузере. Открывайте, пересобирайте или удаляйте.`
              : 'Здесь появятся маршруты, которые вы соберёте. Пока — чистый лист и много вариантов.'}
          </Text>
        </Box>
        <Button as={Link} to="/#planner" variant="accent" size="lg" rightIcon={<Icon name="sparkles" size={17} />} flexShrink={0}>
          Собрать новый
        </Button>
      </Flex>

      {trips.length ? (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4.5} mt={{ base: 8, md: 10 }}>
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={remove} />
          ))}
        </SimpleGrid>
      ) : (
        <Box
          mt={{ base: 8, md: 12 }}
          bg="cream"
          border="1px dashed"
          borderColor="line"
          borderRadius="28px"
          overflow="hidden"
          display="grid"
          gridTemplateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }}
        >
          <Box p={{ base: 7, md: 10 }}>
            <Box className="eyebrow" mb={4}>Пока пусто</Box>
            <Text fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1.1">
              Первая поездка
              <br />
              начинается с идеи
            </Text>
            <Text mt={4} color="inkSoft" fontSize="14px" maxW="420px" lineHeight="1.7">
              Укажите страну, даты и бюджет — Атлас соберёт маршрут, отели и план на каждый день.
              Сохранённые поездки будут ждать вас здесь.
            </Text>
            <Flex gap={3} mt={7} wrap="wrap">
              <Button as={Link} to="/#planner" variant="accent" rightIcon={<Icon name="arrow-right" size={16} />}>
                Собрать маршрут
              </Button>
              <Button as={Link} to="/#destinations" variant="outline">
                Посмотреть направления
              </Button>
            </Flex>
          </Box>
          <Box position="relative" minH={{ base: '240px', lg: '100%' }}>
            <DestinationArt scene="mountains" palette={['#E9B44C', '#C96F4A', '#315A4B']} />
            <Box position="absolute" inset={0} bg="linear-gradient(90deg, #FCF9F2 0%, rgba(252,249,242,0) 40%)" />
            <Box position="absolute" right={6} bottom={6} bg="rgba(252,249,242,0.9)" backdropFilter="blur(8px)" borderRadius="14px" px={4} py={3}>
              <Flex align="center" gap={2}>
                <Icon name="sparkles" size={15} style={{ color: '#C96F4A' }} />
                <Text fontSize="10px" fontWeight={700}>Atlas AI · 2 минуты</Text>
              </Flex>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
