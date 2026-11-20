import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import type { Trip } from '../../types'
import { formatMoney } from '../../utils/format'
import { BudgetRing } from '../ui/BudgetRing'
import { Icon, type IconName } from '../ui/Icon'
import { SectionHeading, SectionShell } from './SectionHeading'

export const BudgetSection = ({ trip }: { trip: Trip }) => {
  const { budget } = trip
  const reserve = budget.categories.find((category) => category.key === 'reserve')

  return (
    <SectionShell id="budget">
      <SectionHeading
        eyebrow="Бюджет"
        title="Куда уходят деньги"
        description="Каждая категория посчитана под длительность поездки, количество путешественников и выбранные отели. Сумма сходится до рубля."
      />

      <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: '0.95fr 1.4fr' }} gap={4.5}>
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          bg="ink"
          color="paper"
          borderRadius={{ base: '22px', lg: '26px' }}
          p={{ base: 6, md: 7 }}
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" right="-70px" top="-80px" w="240px" h="240px" borderRadius="50%" border="1px dashed rgba(246,241,231,0.16)" />
          <Text fontSize="9px" fontWeight={800} letterSpacing="0.16em" textTransform="uppercase" opacity={0.55} mb={6}>
            Всего на поездку
          </Text>
          <Flex align="center" gap={{ base: 4, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
            <BudgetRing
              segments={budget.categories.map((category) => ({ percent: category.percent, color: category.color }))}
              size={190}
              thickness={11}
              trackColor="rgba(246,241,231,0.12)"
            >
              <Box textAlign="center">
                <Text fontSize="9px" opacity={0.55} letterSpacing="0.12em" textTransform="uppercase">Бюджет</Text>
                <Text fontFamily="heading" fontSize="2xl" lineHeight="1.15" mt={1}>
                  {formatMoney(budget.total)} ₽
                </Text>
                <Text fontSize="9px" opacity={0.55} mt={1}>{budget.currency} · всё включено</Text>
              </Box>
            </BudgetRing>
            <Box>
              <Text fontSize="11px" opacity={0.6} mb={1}>На человека</Text>
              <Text fontFamily="heading" fontSize="xl">{budget.perPersonLabel}</Text>
              <Text fontSize="11px" opacity={0.6} mt={4} mb={1}>В среднем в день</Text>
              <Text fontFamily="heading" fontSize="xl">{budget.dailyLabel}</Text>
              <Flex align="center" gap={1.5} mt={5} fontSize="10px" color="#A8C0B3">
                <Icon name="check-circle" size={14} />
                Распределено полностью
              </Flex>
            </Box>
          </Flex>
          <Text mt={6} pt={5} borderTop="1px solid rgba(246,241,231,0.12)" fontSize="11px" lineHeight="1.65" opacity={0.62}>
            {reserve
              ? `Резерв ${formatMoney(reserve.amount)} ₽ — на такси, сувениры сверх плана и спонтанные ужины.`
              : 'Бюджет распределён без резерва — старайтесь придерживаться плана.'}
          </Text>
        </Box>

        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          bg="cream"
          border="1px solid"
          borderColor="line"
          borderRadius={{ base: '22px', lg: '26px' }}
          p={{ base: 5, md: 6 }}
        >
          <Flex justify="space-between" align="baseline" mb={5}>
            <Text fontSize="9px" fontWeight={800} letterSpacing="0.16em" textTransform="uppercase" color="muted">
              Структура расходов
            </Text>
            <Text fontSize="10px" color="muted">{budget.categories.length} категорий</Text>
          </Flex>

          <Box display="grid" gap={4.5}>
            {budget.categories.map((category, index) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <Flex align="center" gap={3}>
                  <Box
                    w="34px"
                    h="34px"
                    borderRadius="10px"
                    bg={`${category.color}1f`}
                    color={category.color}
                    display="grid"
                    placeItems="center"
                    flexShrink={0}
                  >
                    <Icon name={category.icon as IconName} size={16} />
                  </Box>
                  <Box flex="1" minW={0}>
                    <Flex justify="space-between" align="baseline" gap={3}>
                      <Text fontSize="13px" fontWeight={700}>{category.label}</Text>
                      <Flex align="baseline" gap={2} flexShrink={0}>
                        <Text fontSize="13px" fontWeight={800}>{formatMoney(category.amount)} ₽</Text>
                        <Text fontSize="10px" color="muted" w="38px" textAlign="right">{category.percent}%</Text>
                      </Flex>
                    </Flex>
                    <Text fontSize="10px" color="muted" mt={0.5} noOfLines={1}>{category.note}</Text>
                    <Box mt={1.5} h="5px" bg="paper" borderRadius="999px" overflow="hidden">
                      <Box
                        h="100%"
                        w={`${Math.max(category.percent, 1)}%`}
                        bg={category.color}
                        borderRadius="999px"
                        transition="width .7s cubic-bezier(.22,1,.36,1)"
                      />
                    </Box>
                  </Box>
                </Flex>
              </motion.div>
            ))}
          </Box>

          <SimpleGrid columns={2} spacing={3} mt={6} pt={4} borderTop="1px solid" borderColor="line">
            <Box>
              <Text fontSize="9px" fontWeight={800} letterSpacing="0.12em" textTransform="uppercase" color="muted" mb={1}>Отели</Text>
              <Text fontSize="12px" fontWeight={700}>
                {trip.hotels.length} {trip.hotels.length === 1 ? 'отель' : trip.hotels.length < 5 ? 'отеля' : 'отелей'} · {trip.stats.nights} ночей
              </Text>
            </Box>
            <Box>
              <Text fontSize="9px" fontWeight={800} letterSpacing="0.12em" textTransform="uppercase" color="muted" mb={1}>На человека в день</Text>
              <Text fontSize="12px" fontWeight={700}>{formatMoney(budget.daily / trip.stats.travelers)} ₽</Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </SectionShell>
  )
}
