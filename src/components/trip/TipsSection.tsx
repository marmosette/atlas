import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import type { Trip } from '../../types'
import { Icon } from '../ui/Icon'
import { SectionHeading, SectionShell } from './SectionHeading'

const ChecklistGroup = ({
  title,
  icon,
  items,
  checked,
  onToggle,
}: {
  title: string
  icon: 'shield' | 'bag'
  items: string[]
  checked: Set<string>
  onToggle: (item: string) => void
}) => (
  <Box>
    <Flex align="center" gap={2} mb={3}>
      <Icon name={icon} size={15} style={{ opacity: 0.55 }} />
      <Text fontSize="9px" fontWeight={800} letterSpacing="0.14em" textTransform="uppercase" color="muted">
        {title}
      </Text>
    </Flex>
    <Box display="grid" gap={1.5}>
      {items.map((item) => {
        const isChecked = checked.has(item)
        return (
          <Flex
            key={item}
            as="button"
            type="button"
            onClick={() => onToggle(item)}
            align="flex-start"
            gap={2.5}
            textAlign="left"
            py={1.5}
            opacity={isChecked ? 0.5 : 1}
            transition="opacity .2s ease"
          >
            <Box
              w="18px"
              h="18px"
              borderRadius="6px"
              border="1px solid"
              borderColor={isChecked ? 'moss' : 'line'}
              bg={isChecked ? 'moss' : 'transparent'}
              color="paper"
              display="grid"
              placeItems="center"
              flexShrink={0}
              mt="1px"
              transition="all .2s ease"
            >
              {isChecked && <Icon name="check" size={11} />}
            </Box>
            <Text fontSize="12px" lineHeight="1.5" textDecoration={isChecked ? 'line-through' : 'none'}>
              {item}
            </Text>
          </Flex>
        )
      })}
    </Box>
  </Box>
)

export const TipsSection = ({ trip }: { trip: Trip }) => {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const totalItems = trip.checklist.documents.length + trip.checklist.packing.length
  const progress = totalItems ? Math.round((checked.size / totalItems) * 100) : 0

  const toggle = (item: string) => {
    setChecked((current) => {
      const next = new Set(current)
      if (next.has(item)) next.delete(item)
      else next.add(item)
      return next
    })
  }

  const tips = useMemo(() => trip.tips.slice(0, 6), [trip.tips])

  return (
    <SectionShell id="tips">
      <SectionHeading
        eyebrow="Перед поездкой"
        title="Советы и чемодан"
        description="Маленькие детали, которые обычно вспоминаются в аэропорту. Сохраните чек-лист и отмечайте пункты по мере сборов."
      />

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4.5}>
        <Box>
          {trip.aiNote && (
            <Box
              as={motion.div}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              bg="rgba(201,111,74,0.08)"
              border="1px solid rgba(201,111,74,0.18)"
              borderRadius="20px"
              p={{ base: 5, md: 6 }}
              mb={4}
            >
              <Flex align="center" gap={2} mb={3}>
                <Icon name="quote" size={17} style={{ color: '#C96F4A' }} />
                <Text fontSize="9px" fontWeight={800} letterSpacing="0.14em" textTransform="uppercase" color="terracottaDark">
                  Кураторский комментарий
                </Text>
              </Flex>
              <Text fontFamily="heading" fontSize={{ base: 'lg', md: 'xl' }} lineHeight="1.5">
                {trip.aiNote}
              </Text>
            </Box>
          )}

          <Box bg="cream" border="1px solid" borderColor="line" borderRadius="22px" p={{ base: 5, md: 6 }}>
            <Text fontSize="9px" fontWeight={800} letterSpacing="0.14em" textTransform="uppercase" color="muted" mb={4}>
              Что стоит знать
            </Text>
            <Box display="grid" gap={0}>
              {tips.map((tip, index) => (
                <Flex
                  key={tip}
                  gap={3.5}
                  py={3.5}
                  borderBottom={index === tips.length - 1 ? 'none' : '1px solid'}
                  borderColor="line"
                  align="flex-start"
                >
                  <Text fontFamily="heading" fontSize="sm" color="terracotta" flexShrink={0} w="24px" pt="1px">
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <Text fontSize="12px" lineHeight="1.65">{tip}</Text>
                </Flex>
              ))}
            </Box>
            <Flex mt={4} pt={4} borderTop="1px solid" borderColor="line" align="center" gap={2}>
              <Icon name="globe" size={15} style={{ opacity: 0.55 }} />
              <Text fontSize="10px" color="muted">
                {trip.country.currency} · {trip.country.language} · {trip.country.visa}
              </Text>
            </Flex>
          </Box>
        </Box>

        <Box bg="cream" border="1px solid" borderColor="line" borderRadius="22px" p={{ base: 5, md: 6 }}>
          <Flex justify="space-between" align="center" gap={3} mb={2}>
            <Box>
              <Text fontSize="9px" fontWeight={800} letterSpacing="0.14em" textTransform="uppercase" color="muted">Чек-лист</Text>
              <Text fontFamily="heading" fontSize="xl" mt={1}>Собраться спокойно</Text>
            </Box>
            <Box textAlign="right">
              <Text fontSize="11px" fontWeight={800}>{checked.size}/{totalItems}</Text>
              <Text fontSize="9px" color="muted">готово</Text>
            </Box>
          </Flex>
          <Box h="5px" bg="paper" borderRadius="999px" overflow="hidden" mb={6}>
            <Box h="100%" w={`${progress}%`} bg="moss" borderRadius="999px" transition="width .35s ease" />
          </Box>

          <Box display="grid" gap={6}>
            <ChecklistGroup
              title="Документы"
              icon="shield"
              items={trip.checklist.documents}
              checked={checked}
              onToggle={toggle}
            />
            <ChecklistGroup
              title="В чемодан"
              icon="bag"
              items={trip.checklist.packing}
              checked={checked}
              onToggle={toggle}
            />
          </Box>

          <Flex mt={5} pt={4} borderTop="1px solid" borderColor="line" align="center" gap={2} color="muted" fontSize="10px">
            <Icon name="info" size={13} />
            Список не сохраняется между визитами — отметьте важное заранее.
          </Flex>
        </Box>
      </SimpleGrid>
    </SectionShell>
  )
}
