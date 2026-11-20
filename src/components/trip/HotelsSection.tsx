import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import type { Trip } from '../../types'
import { formatMoney } from '../../utils/format'
import { DestinationArt } from '../art/DestinationArt'
import { Icon } from '../ui/Icon'
import { SectionHeading, SectionShell } from './SectionHeading'

export const HotelsSection = ({ trip }: { trip: Trip }) => {
  const stay = trip.budget.categories.find((category) => category.key === 'stay')
  return (
    <SectionShell id="hotels">
      <SectionHeading
        eyebrow="Проживание"
        title="Где остановитесь"
        description="Отель в каждом городе выбран под бюджет, локацию и темп маршрута. Цены — ориентировочные, за номер на двоих."
        right={
          stay ? (
            <Flex align="center" gap={2} bg="cream" border="1px solid" borderColor="line" borderRadius="999px" px={3.5} py={2} flexShrink={0}>
              <Icon name="bed" size={15} style={{ opacity: 0.6 }} />
              <Text fontSize="11px" fontWeight={700}>{formatMoney(stay.amount)} ₽ за всё проживание</Text>
            </Flex>
          ) : undefined
        }
      />

      <SimpleGrid columns={{ base: 1, lg: 1 }} spacing={4}>
        {trip.hotels.map((hotel, index) => {
          const city = trip.cities.find((item) => item.id === hotel.cityId)
          return (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <Box
                display="grid"
                gridTemplateColumns={{ base: '1fr', md: '260px 1fr' }}
                bg="cream"
                border="1px solid"
                borderColor="line"
                borderRadius="22px"
                overflow="hidden"
                _hover={{ boxShadow: 'var(--shadow-card)' }}
                transition="box-shadow .3s ease"
              >
                <Box position="relative" minH={{ base: '180px', md: '210px' }} overflow="hidden">
                  <DestinationArt scene={city?.scene || trip.country.scene} palette={trip.country.palette} />
                  <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(22,48,43,0.05) 40%, rgba(22,48,43,0.55) 100%)" />
                  <Box position="absolute" top={3} left={3} bg="rgba(252,249,242,0.92)" backdropFilter="blur(8px)" borderRadius="999px" px={2.5} py={1} fontSize="9px" fontWeight={800} letterSpacing="0.1em">
                    {hotel.tier}★ · {hotel.cityName}
                  </Box>
                  <Box position="absolute" left={4} bottom={3.5} color="white">
                    <Text fontSize="9px" fontWeight={800} letterSpacing="0.14em" textTransform="uppercase" opacity={0.72}>Выбран для вас</Text>
                    <Text fontFamily="heading" fontSize="xl" mt={1} lineHeight="1.1">{hotel.cityName}</Text>
                  </Box>
                </Box>

                <Box p={{ base: 4.5, md: 5.5 }}>
                  <Flex justify="space-between" align="flex-start" gap={4}>
                    <Box>
                      <Text fontFamily="heading" fontSize="2xl" lineHeight="1.15">{hotel.name}</Text>
                      <Flex align="center" gap={2} mt={2} wrap="wrap">
                        <Flex align="center" gap={1} bg="rgba(217,164,65,0.14)" color="#8A641F" borderRadius="999px" px={2} py={0.8} fontSize="11px" fontWeight={800}>
                          <Icon name="star" size={11} />
                          {hotel.rating}
                        </Flex>
                        <Text fontSize="10px" color="muted">{hotel.reviews} отзывов · {hotel.area}</Text>
                      </Flex>
                    </Box>
                    <Box textAlign="right" flexShrink={0}>
                      <Text fontSize="10px" color="muted">за ночь</Text>
                      <Text fontFamily="heading" fontSize="xl" lineHeight="1.1">{formatMoney(hotel.pricePerNight)} ₽</Text>
                    </Box>
                  </Flex>

                  <Text mt={3.5} fontSize="12px" color="inkSoft" lineHeight="1.65">{hotel.description}</Text>

                  <Flex gap={1.5} mt={3.5} wrap="wrap">
                    {hotel.tags.map((tag) => (
                      <Box key={tag} bg="paper" border="1px solid" borderColor="line" borderRadius="999px" px={2.5} py={1} fontSize="10px" color="inkSoft">
                        {tag}
                      </Box>
                    ))}
                  </Flex>

                  <Flex
                    mt={4.5}
                    pt={4}
                    borderTop="1px solid"
                    borderColor="line"
                    justify="space-between"
                    align="center"
                    gap={4}
                    wrap="wrap"
                  >
                    <Flex align="center" gap={2} fontSize="11px" color="muted">
                      <Icon name="calendar" size={14} />
                      {hotel.nights} {hotel.nights === 1 ? 'ночь' : hotel.nights < 5 ? 'ночи' : 'ночей'} · {hotel.rooms} {hotel.rooms === 1 ? 'номер' : 'номера'}
                    </Flex>
                    <Box textAlign="right">
                      <Text fontSize="10px" color="muted">итого за проживание</Text>
                      <Text fontSize="14px" fontWeight={800}>{formatMoney(hotel.total)} ₽</Text>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            </motion.div>
          )
        })}
      </SimpleGrid>

      <Text mt={4} fontSize="10px" color="muted">
        * Стоимость рассчитана демо-движком под ваш бюджет и может отличаться от актуальных тарифов отеля.
      </Text>
    </SectionShell>
  )
}
