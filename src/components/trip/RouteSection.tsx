import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import type { Trip } from '../../types'
import { DestinationArt } from '../art/DestinationArt'
import { Icon } from '../ui/Icon'
import { RouteMap } from './RouteMap'
import { SectionHeading, SectionShell } from './SectionHeading'

export const RouteSection = ({ trip }: { trip: Trip }) => (
  <SectionShell id="route">
    <SectionHeading
      eyebrow="Маршрут"
      title={
        <>
          {trip.stats.citiesLabel} — один ритм
        </>
      }
      description="Города идут в логическом порядке: без лишних переездов и дней, потерянных на дорогу. Ночи уже распределены."
      right={
        <Flex align="center" gap={2} fontSize="11px" color="muted" flexShrink={0}>
          <Icon name="route" size={15} />
          {trip.transfers.length ? `Переезды: ${trip.transfers.map((item) => item.mode).join(' · ')}` : 'Без переездов'}
        </Flex>
      }
    />

    <Box
      bg="cream"
      border="1px solid"
      borderColor="line"
      borderRadius={{ base: '22px', md: '28px' }}
      px={{ base: 4, md: 8 }}
      pt={{ base: 6, md: 8 }}
      pb={{ base: 4, md: 5 }}
      boxShadow="var(--shadow-soft)"
    >
      <RouteMap cities={trip.cities} palette={trip.country.palette} />
    </Box>

    <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4.5} mt={5}>
      {trip.cities.map((city, index) => {
        const hotel = trip.hotels.find((item) => item.cityId === city.id)
        return (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
          >
            <Box
              h="100%"
              bg="cream"
              border="1px solid"
              borderColor="line"
              borderRadius="22px"
              overflow="hidden"
              _hover={{ boxShadow: 'var(--shadow-card)' }}
              transition="box-shadow .3s ease"
            >
              <Box position="relative" aspectRatio="16 / 9" overflow="hidden">
                <DestinationArt scene={city.scene} palette={trip.country.palette} />
                <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(22,48,43,0) 45%, rgba(22,48,43,0.55) 100%)" />
                <Flex position="absolute" top={3} left={3} right={3} justify="space-between">
                  <Box bg="rgba(252,249,242,0.9)" backdropFilter="blur(8px)" borderRadius="999px" px={2.5} py={1} fontSize="9px" fontWeight={800} letterSpacing="0.1em">
                    {city.nightsLabel}
                  </Box>
                  <Text fontFamily="heading" fontSize="sm" color="white" opacity={0.8}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </Flex>
                <Box position="absolute" left={4} bottom={3.5} color="white">
                  <Text fontFamily="heading" fontSize="2xl" lineHeight="1.05">{city.name}</Text>
                  <Text fontSize="10px" opacity={0.8} mt={0.5}>{city.tagline}</Text>
                </Box>
              </Box>
              <Box p={4.5}>
                <Text fontSize="12px" color="inkSoft" lineHeight="1.65">
                  {city.why && city.why !== city.tagline ? city.why : city.description}
                </Text>
                <Box mt={3.5} display="grid" gap={2}>
                  {city.highlights.slice(0, 3).map((highlight) => (
                    <Flex key={highlight.title} align="flex-start" gap={2}>
                      <Box w="4px" h="4px" borderRadius="50%" bg="terracotta" mt="7px" flexShrink={0} />
                      <Text fontSize="11px" fontWeight={600} lineHeight="1.45">{highlight.title}</Text>
                    </Flex>
                  ))}
                </Box>
                {hotel && (
                  <Flex mt={4} pt={3.5} borderTop="1px solid" borderColor="line" align="center" gap={2}>
                    <Icon name="bed" size={14} style={{ opacity: 0.55 }} />
                    <Text fontSize="10px" color="muted" noOfLines={1}>{hotel.name}</Text>
                  </Flex>
                )}
              </Box>
            </Box>
          </motion.div>
        )
      })}
    </SimpleGrid>
  </SectionShell>
)
