import { Box, Button, Flex, Skeleton, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { BudgetSection } from '../components/trip/BudgetSection'
import { DayPlanSection } from '../components/trip/DayPlanSection'
import { HotelsSection } from '../components/trip/HotelsSection'
import { RouteSection } from '../components/trip/RouteSection'
import { TipsSection } from '../components/trip/TipsSection'
import { TripHero } from '../components/trip/TripHero'
import { Icon } from '../components/ui/Icon'
import { api } from '../services/api'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { tripsActions } from '../store/tripsSlice'

const NAV_ITEMS = [
  { id: 'route', label: 'Маршрут' },
  { id: 'hotels', label: 'Отели' },
  { id: 'budget', label: 'Бюджет' },
  { id: 'days', label: 'По дням' },
  { id: 'tips', label: 'Советы' },
]

const TripSkeleton = () => (
  <Box className="atlas-container" pt={10} pb={20}>
    <Skeleton height="14px" width="120px" borderRadius="999px" mb={8} />
    <Flex gap={10} direction={{ base: 'column', lg: 'row' }}>
      <Box flex="1.3">
        <Skeleton height="12px" width="100px" mb={4} />
        <Skeleton height="58px" width="90%" mb={3} />
        <Skeleton height="58px" width="70%" mb={6} />
        <Skeleton height="16px" width="100%" mb={2} />
        <Skeleton height="16px" width="92%" mb={2} />
        <Skeleton height="16px" width="85%" mb={8} />
        <Flex gap={2}>
          <Skeleton height="30px" width="160px" borderRadius="999px" />
          <Skeleton height="30px" width="130px" borderRadius="999px" />
          <Skeleton height="30px" width="180px" borderRadius="999px" />
        </Flex>
      </Box>
      <Skeleton height="340px" flex="0.9" borderRadius="30px" />
    </Flex>
    <Skeleton height="1px" width="100%" mt={12} mb={8} />
    <Box display="grid" gridTemplateColumns={{ base: '1fr 1fr', md: 'repeat(4,1fr)' }} gap={6}>
      {[0, 1, 2, 3].map((item) => (
        <Box key={item}>
          <Skeleton height="10px" width="70px" mb={3} />
          <Skeleton height="22px" width="150px" mb={2} />
          <Skeleton height="10px" width="120px" />
        </Box>
      ))}
    </Box>
  </Box>
)

const TripNotFound = ({ message }: { message?: string }) => (
  <Box className="atlas-container" pt={{ base: 16, md: 24 }} pb={20} textAlign="center">
    <Box w="88px" h="88px" borderRadius="50%" bg="cream" border="1px solid" borderColor="line" display="grid" placeItems="center" mx="auto" color="terracotta">
      <Icon name="compass" size={38} />
    </Box>
    <Text fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} mt={7}>
      Маршрут не найден
    </Text>
    <Text mt={3} color="inkSoft" maxW="440px" mx="auto" fontSize="14px" lineHeight="1.7">
      {message || 'Возможно, ссылка устарела или маршрут был удалён. Соберите новый — это займёт пару минут.'}
    </Text>
    <Flex justify="center" gap={3} mt={7} wrap="wrap">
      <Button as={Link} to="/#planner" variant="accent" rightIcon={<Icon name="sparkles" size={17} />}>
        Собрать новый маршрут
      </Button>
      <Button as={Link} to="/trips" variant="outline">
        Мои поездки
      </Button>
    </Flex>
  </Box>
)

export const TripPage = () => {
  const { id = '' } = useParams()
  const dispatch = useAppDispatch()
  const storedTrip = useAppSelector((state) => state.trips.items.find((trip) => trip.id === id))
  const [remoteTrip, setRemoteTrip] = useState(null as import('../types').Trip | null)
  const [loading, setLoading] = useState(!storedTrip)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setRemoteTrip(null)
    setError(null)
    if (storedTrip) {
      setLoading(false)
      return undefined
    }
    let active = true
    setLoading(true)
    api
      .getTrip(id)
      .then(({ trip }) => {
        if (!active) return
        setRemoteTrip(trip)
        dispatch(tripsActions.upsertTrip(trip))
      })
      .catch(() => {
        if (active) setError('Маршрут не найден или сервер был перезапущен. Соберите новый.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id, storedTrip, dispatch])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [id])

  const trip = storedTrip || remoteTrip

  if (loading && !trip) return <TripSkeleton />
  if (!trip) return <TripNotFound message={error || undefined} />

  return (
    <Box pb={{ base: 8, md: 12 }}>
      <TripHero trip={trip} />

      <Box
        position="sticky"
        top={{ base: '68px', md: '78px' }}
        zIndex={80}
        mt={{ base: 8, md: 10 }}
        bg="rgba(246,241,231,0.9)"
        backdropFilter="blur(16px)"
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="line"
        className="no-print"
      >
        <Flex className="atlas-container" align="center" justify="space-between" gap={3} py={2.5}>
          <Flex gap={1} overflowX="auto" className="hide-scrollbar" flex="1">
            {NAV_ITEMS.map((item) => (
              <Box
                as="a"
                key={item.id}
                href={`#${item.id}`}
                px={3}
                py={2}
                borderRadius="999px"
                fontSize="11px"
                fontWeight={700}
                color="inkSoft"
                whiteSpace="nowrap"
                transition="background .2s ease, color .2s ease"
                _hover={{ bg: 'sand', color: 'ink' }}
              >
                {item.label}
              </Box>
            ))}
          </Flex>
          <Button
            as={Link}
            to="/#planner"
            size="sm"
            variant="solid"
            flexShrink={0}
            rightIcon={<Icon name="sparkles" size={14} />}
          >
            <Box as="span" display={{ base: 'none', sm: 'inline' }}>Новый маршрут</Box>
          </Button>
        </Flex>
      </Box>

      <RouteSection trip={trip} />
      <HotelsSection trip={trip} />
      <BudgetSection trip={trip} />
      <DayPlanSection trip={trip} />
      <TipsSection trip={trip} />

      <Box className="atlas-container print-only" mt={10}>
        <Text fontSize="10px" color="muted">
          {trip.meta.disclaimer}
        </Text>
      </Box>
    </Box>
  )
}
