import { Box, Flex, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import type { CountryCard } from '../../types'
import { formatMoney } from '../../utils/format'
import { DestinationArt } from '../art/DestinationArt'
import { CountryMark } from '../planner/CountrySelect'
import { Icon } from '../ui/Icon'

interface DestinationCardProps {
  country: CountryCard
  onClick: (id: string) => void
  index?: number
}

export const DestinationCard = ({ country, onClick, index = 0 }: DestinationCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    whileHover={{ y: -5 }}
    style={{ height: '100%' }}
  >
    <Box
      as="button"
      type="button"
      onClick={() => onClick(country.id)}
      w="100%"
      h="100%"
      textAlign="left"
      bg="cream"
      border="1px solid"
      borderColor="line"
      borderRadius="22px"
      overflow="hidden"
      transition="box-shadow .3s ease, border-color .3s ease"
      _hover={{ boxShadow: 'var(--shadow-card)', borderColor: 'rgba(201,111,74,0.55)', '& .destination-art': { transform: 'scale(1.045)' }, '& .destination-arrow': { bg: 'terracotta', color: 'white', transform: 'rotate(0deg)' } }}
    >
      <Box position="relative" aspectRatio="4 / 3" overflow="hidden">
        <Box
          className="destination-art"
          position="absolute"
          inset={0}
          transition="transform .8s cubic-bezier(.22,1,.36,1)"
        >
          <DestinationArt scene={country.scene} palette={country.palette} />
        </Box>
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(180deg, rgba(22,48,43,0.04) 30%, rgba(22,48,43,0.62) 100%)"
        />
        <Box position="absolute" top={3.5} left={3.5} maxW="calc(100% - 64px)">
          <Box
            bg="rgba(252,249,242,0.9)"
            backdropFilter="blur(8px)"
            borderRadius="999px"
            px={2.5}
            py={1}
            fontSize="9px"
            fontWeight={800}
            letterSpacing="0.12em"
            textTransform="uppercase"
            noOfLines={1}
          >
            {country.region}
          </Box>
        </Box>
        <Box position="absolute" top={3} right={3}>
          <CountryMark country={country} size={32} />
        </Box>
        <Box position="absolute" left={4} right={4} bottom={3.5} color="white">
          <Text fontFamily="heading" fontSize="2xl" lineHeight="1.05" textShadow="0 2px 12px rgba(0,0,0,0.18)">
            {country.name}
          </Text>
          <Text fontSize="11px" mt={1} color="rgba(255,255,255,0.82)">{country.tagline}</Text>
        </Box>
      </Box>

      <Flex p={4} align="center" justify="space-between" gap={3}>
        <Box>
          <Text fontSize="11px" color="muted" mb={1}>
            {country.cities} {country.cities === 1 ? 'город' : country.cities < 5 ? 'города' : 'городов'} · от {formatMoney(country.fromPrice)} ₽
          </Text>
          <Text fontSize="12px" fontWeight={700}>Собрать маршрут</Text>
        </Box>
        <Flex
          className="destination-arrow"
          w="34px"
          h="34px"
          borderRadius="50%"
          border="1px solid"
          borderColor="line"
          align="center"
          justify="center"
          flexShrink={0}
          transition="all .25s ease"
          transform="rotate(-45deg)"
        >
          <Icon name="arrow-right" size={15} />
        </Flex>
      </Flex>
    </Box>
  </motion.div>
)
