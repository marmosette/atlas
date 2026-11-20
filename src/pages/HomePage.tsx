import { Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

import { DestinationArt } from '../components/art/DestinationArt'
import { DestinationCard } from '../components/home/DestinationCard'
import { PlannerForm } from '../components/planner/PlannerForm'
import { CountryMark } from '../components/planner/CountrySelect'
import { BudgetRing } from '../components/ui/BudgetRing'
import { Icon } from '../components/ui/Icon'
import { api } from '../services/api'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { plannerActions } from '../store/plannerSlice'
import { fallbackCountries, fallbackFeatured } from '../data/countries'
import type { CountryCard, CountryOption } from '../types'
import { formatDateRange, formatMoney, plural } from '../utils/format'

const HERO_SEGMENTS = [
  { percent: 34, color: '#C96F4A' },
  { percent: 24, color: '#D9A441' },
  { percent: 21, color: '#3F6E63' },
  { percent: 13, color: '#8FA08A' },
  { percent: 8, color: '#C9C0B2' },
]

const steps = [
  {
    number: '01',
    icon: 'compass' as const,
    title: 'Задайте рамки',
    text: 'Страна, даты, бюджет и темп. Можно добавить пожелания — от «больше природы» до «без музеев».',
  },
  {
    number: '02',
    icon: 'sparkles' as const,
    title: 'ИИ собирает маршрут',
    text: 'Города, отели, распределение бюджета и план на каждый день. Без десятков открытых вкладок.',
  },
  {
    number: '03',
    icon: 'plane' as const,
    title: 'Едете и меняете',
    text: 'Маршрут сохраняется. Можно пересобрать его одним нажатием, если поменялись даты или бюджет.',
  },
]

export const HomePage = () => {
  const dispatch = useAppDispatch()
  const draft = useAppSelector((state) => state.planner.draft)
  const [countries, setCountries] = useState<CountryOption[]>(fallbackCountries)
  const [featured, setFeatured] = useState<CountryCard[]>(fallbackFeatured)
  const [loadingCountries, setLoadingCountries] = useState(true)

  useEffect(() => {
    let active = true
    api
      .getCountries()
      .then((data) => {
        if (!active) return
        if (data.countries?.length) setCountries(data.countries)
        if (data.featured?.length) setFeatured(data.featured)
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoadingCountries(false)
      })
    return () => {
      active = false
    }
  }, [])

  const currentCountry = useMemo(() => {
    const selected = countries.find((country) => country.id === draft.country)
    if (selected) return selected
    return countries[0] || fallbackCountries[0]
  }, [countries, draft.country])

  const totalCities = useMemo(
    () => countries.reduce((sum, country) => sum + country.cities, 0),
    [countries]
  )

  const currentCard = useMemo(
    () => featured.find((country) => country.id === currentCountry?.id),
    [currentCountry?.id, featured]
  )

  const scrollToPlanner = () => {
    document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const chooseCountry = (id: string) => {
    dispatch(plannerActions.setCountry(id))
    window.setTimeout(scrollToPlanner, 60)
  }

  const isSurprise = draft.country === 'surprise'
  const artCountry = isSurprise ? featured[0] || currentCard : currentCard || currentCountry
  const artScene = artCountry?.scene || 'mountains'
  const artPalette = artCountry?.palette || ['#E9B44C', '#C96F4A', '#315A4B']

  return (
    <Box>
      <Box position="relative" overflow="hidden" pt={{ base: 10, md: 16 }} pb={{ base: 24, md: 32 }}>
        <Box
          position="absolute"
          top="-220px"
          right="-140px"
          w="620px"
          h="620px"
          borderRadius="50%"
          bg="radial-gradient(circle, rgba(217,164,65,0.22) 0%, rgba(217,164,65,0) 68%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          left="-220px"
          top="280px"
          w="520px"
          h="520px"
          borderRadius="50%"
          bg="radial-gradient(circle, rgba(201,111,74,0.13) 0%, rgba(201,111,74,0) 70%)"
          pointerEvents="none"
        />
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.22 }}
          viewBox="0 0 1440 760"
          preserveAspectRatio="none"
        >
          <path d="M-40 560C220 500 330 610 560 548s300-160 520-80 290 30 420-60" fill="none" stroke="#C96F4A" strokeWidth="1" strokeDasharray="4 9" />
          <path d="M-40 610C220 550 330 660 560 598s300-160 520-80 290 30 420-60" fill="none" stroke="#16302B" strokeWidth="1" strokeDasharray="3 11" opacity="0.4" />
        </svg>

        <Box className="atlas-container" position="relative">
          <SimpleGrid columns={{ base: 1, lg: 12 }} spacing={{ base: 12, lg: 6 }} alignItems="center">
            <Box gridColumn={{ base: 'span 1', lg: 'span 7' }}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Box className="eyebrow" mb={5}>ИИ-конструктор путешествий</Box>
                <Text
                  as="h1"
                  className="display-title"
                  fontSize={{ base: '44px', sm: '56px', lg: '66px', xl: '72px' }}
                  maxW="680px"
                >
                  Куда отправимся
                  <br />
                  <Box as="em">в этот раз?</Box>
                </Text>
                <Text className="lead" mt={6} maxW="500px">
                  Назовите страну, даты и бюджет. Атлас соберёт маршрут по городам, подберёт отели,
                  распределит деньги и распишет каждый день — от завтрака до последнего бокала.
                </Text>
                <Flex mt={8} gap={3} wrap="wrap">
                  <Button
                    size="lg"
                    variant="solid"
                    onClick={scrollToPlanner}
                    rightIcon={<Icon name="arrow-right" size={18} />}
                    height="56px"
                    px={7}
                  >
                    Собрать маршрут
                  </Button>
                  <Button
                    as="a"
                    href="#how"
                    size="lg"
                    variant="outline"
                    height="56px"
                    px={6}
                    rightIcon={<Icon name="arrow-up-right" size={17} />}
                  >
                    Как это работает
                  </Button>
                </Flex>

                <Flex mt={{ base: 9, md: 11 }} gap={{ base: 6, md: 9 }} wrap="wrap">
                  {[
                    { value: `${countries.length}`, label: 'направлений' },
                    { value: `${totalCities}`, label: plural(totalCities, 'город', 'города', 'городов') },
                    { value: '2 мин', label: 'на маршрут' },
                  ].map((stat) => (
                    <Box key={stat.label}>
                      <Text fontFamily="heading" fontSize="2xl" lineHeight="1">{stat.value}</Text>
                      <Text mt={1} fontSize="10px" fontWeight={700} letterSpacing="0.12em" textTransform="uppercase" color="muted">
                        {stat.label}
                      </Text>
                    </Box>
                  ))}
                </Flex>
              </motion.div>
            </Box>

            <Box gridColumn={{ base: 'span 1', lg: 'span 5' }} display={{ base: 'none', md: 'block' }}>
              <Box position="relative" maxW="460px" ml="auto" mr={{ base: 'auto', lg: 0 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30, rotate: -4 }}
                  animate={{ opacity: 1, y: 0, rotate: -2.2 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <Box
                    position="relative"
                    borderRadius="30px"
                    overflow="hidden"
                    boxShadow="0 30px 80px rgba(22,48,43,0.22)"
                    border="6px solid #FCF9F2"
                    bg="sand"
                  >
                    <Box aspectRatio="4 / 4.55" position="relative">
                      <DestinationArt scene={artScene} palette={artPalette} variant="hero" />
                      <Box position="absolute" inset={0} bg="linear-gradient(180deg, rgba(22,48,43,0) 38%, rgba(22,48,43,0.72) 100%)" />
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
                          letterSpacing="0.14em"
                          textTransform="uppercase"
                        >
                          <Icon name="sparkles" size={12} />
                          Маршрут готов
                        </Flex>
                        <Box
                          w="34px"
                          h="34px"
                          borderRadius="50%"
                          bg="rgba(252,249,242,0.92)"
                          backdropFilter="blur(8px)"
                          display="grid"
                          placeItems="center"
                          fontFamily="heading"
                          fontSize="11px"
                        >
                          AI
                        </Box>
                      </Flex>
                      <Box position="absolute" left={5} right={5} bottom={5} color="#FCF9F2">
                        <Text fontSize="9px" fontWeight={800} letterSpacing="0.16em" textTransform="uppercase" opacity={0.72} mb={2}>
                          {isSurprise ? 'Направление-сюрприз' : `${currentCountry?.region || 'Мир'} · ${draft.startDate ? formatDateRange(draft.startDate, draft.endDate) : 'даты гибкие'}`}
                        </Text>
                        <Text fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1.05">
                          {isSurprise ? 'Удивите меня' : currentCountry?.name || 'Грузия'}
                        </Text>
                        <Flex mt={3} gap={2} wrap="wrap">
                          {[
                            `${Math.max(1, Math.round((new Date(draft.endDate).getTime() - new Date(draft.startDate).getTime()) / 86400000) + 1 || 7)} дней`,
                            `${currentCountry?.cities || 3} ${plural(currentCountry?.cities || 3, 'город', 'города', 'городов')}`,
                            `${formatMoney(draft.budget)} ₽`,
                          ].map((item) => (
                            <Box key={item} bg="rgba(252,249,242,0.16)" border="1px solid rgba(252,249,242,0.24)" backdropFilter="blur(6px)" borderRadius="999px" px={2.5} py={1} fontSize="10px" fontWeight={600}>
                              {item}
                            </Box>
                          ))}
                        </Flex>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -18, y: 12 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  style={{ position: 'absolute', left: -44, bottom: 122, zIndex: 3 }}
                >
                  <Box
                    className="float-soft"
                    bg="cream"
                    border="1px solid var(--line)"
                    borderRadius="18px"
                    boxShadow="var(--shadow-card)"
                    p={3.5}
                    w="198px"
                  >
                    <Flex align="center" gap={3}>
                      <BudgetRing segments={HERO_SEGMENTS} size={52} thickness={9}>
                        <Text fontSize="9px" fontWeight={800}>₽</Text>
                      </BudgetRing>
                      <Box>
                        <Text fontSize="9px" color="muted" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase">Бюджет</Text>
                        <Text fontSize="15px" fontWeight={800} lineHeight="1.2">{formatMoney(draft.budget)} ₽</Text>
                        <Text fontSize="9px" color="moss" fontWeight={700}>распределён</Text>
                      </Box>
                    </Flex>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.62 }}
                  style={{ position: 'absolute', right: -24, top: 56, zIndex: 3 }}
                >
                  <Box bg="ink" color="paper" borderRadius="16px" boxShadow="var(--shadow-lift)" px={3.5} py={3} w="184px">
                    <Flex align="center" gap={2} mb={2}>
                      <Icon name="route" size={14} />
                      <Text fontSize="9px" fontWeight={800} letterSpacing="0.12em" textTransform="uppercase" opacity={0.65}>Маршрут</Text>
                    </Flex>
                    <Text fontSize="12px" fontWeight={700} lineHeight="1.35">
                      {isSurprise ? 'Подберём под сезон' : `${currentCountry?.name || 'Грузия'} без спешки`}
                    </Text>
                    <Flex align="center" gap={1.5} mt={2}>
                      {[0, 1, 2].map((index) => (
                        <Box key={index} w="5px" h="5px" borderRadius="50%" bg={index === 0 ? 'terracotta' : 'rgba(246,241,231,0.4)'} />
                      ))}
                      <Text fontSize="9px" opacity={0.55} ml={1}>3 остановки</Text>
                    </Flex>
                  </Box>
                </motion.div>

              </Box>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      <Box className="atlas-container" position="relative" zIndex={10} mt={{ base: -12, md: -20 }} maxW="1000px">
        <PlannerForm countries={countries} loading={loadingCountries} />
      </Box>

      <Box id="how" className="atlas-container" mt={{ base: 20, md: 28 }}>
        <Flex justify="space-between" align="flex-end" gap={8} mb={{ base: 8, md: 10 }} direction={{ base: 'column', md: 'row' }}>
          <Box>
            <Box className="eyebrow" mb={4}>Как это работает</Box>
            <Text as="h2" className="display-title" fontSize={{ base: '3xl', md: '4xl' }} maxW="620px">
              Три шага до поездки, о которой не придётся жалеть
            </Text>
          </Box>
          <Text maxW="310px" color="inkSoft" fontSize="14px" lineHeight="1.7">
            Никаких таблиц и десятка вкладок. Вы задаёте рамки — Атлас берёт на себя логистику и детали.
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 5 }} position="relative">
          <Box
            display={{ base: 'none', md: 'block' }}
            position="absolute"
            top="42px"
            left="16%"
            right="16%"
            borderTop="1px dashed"
            borderColor="rgba(201,111,74,0.4)"
            zIndex={0}
          />
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Box
                position="relative"
                zIndex={1}
                h="100%"
                bg="cream"
                border="1px solid"
                borderColor="line"
                borderRadius="22px"
                p={{ base: 5, md: 6 }}
              >
                <Flex justify="space-between" align="flex-start" mb={7}>
                  <Box w="46px" h="46px" borderRadius="14px" bg="sand" display="grid" placeItems="center" color="terracottaDark">
                    <Icon name={step.icon} size={21} />
                  </Box>
                  <Text fontFamily="heading" fontSize="2xl" color="rgba(22,48,43,0.18)">{step.number}</Text>
                </Flex>
                <Text fontFamily="heading" fontSize="xl" mb={2}>{step.title}</Text>
                <Text fontSize="13px" color="inkSoft" lineHeight="1.65">{step.text}</Text>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      </Box>

      <Box id="destinations" className="atlas-container" mt={{ base: 20, md: 28 }}>
        <Flex justify="space-between" align="flex-end" gap={6} mb={{ base: 7, md: 9 }} direction={{ base: 'column', sm: 'row' }}>
          <Box>
            <Box className="eyebrow" mb={4}>Направления</Box>
            <Text as="h2" className="display-title" fontSize={{ base: '3xl', md: '4xl' }}>
              Куда чаще всего летят
            </Text>
          </Box>
          <Text color="muted" fontSize="13px" maxW="300px" textAlign={{ base: 'left', sm: 'right' }}>
            Нажмите на карточку — страна подставится в конструктор. Остальные {Math.max(countries.length - featured.length, 0)} направлений ждут внутри.
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing={4.5}>
          {featured.map((country, index) => (
            <DestinationCard key={country.id} country={country} onClick={chooseCountry} index={index} />
          ))}
        </SimpleGrid>
      </Box>

      <Box className="atlas-container" mt={{ base: 20, md: 28 }}>
        <Box
          className="grain-panel"
          bg="ink"
          color="paper"
          borderRadius={{ base: '24px', md: '34px' }}
          p={{ base: 6, md: 10, lg: 12 }}
          position="relative"
          overflow="hidden"
        >
          <Box position="absolute" right="-90px" top="-110px" w="360px" h="360px" borderRadius="50%" border="1px dashed rgba(246,241,231,0.14)" />
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 10, lg: 14 }} alignItems="center">
            <Box>
              <Box className="eyebrow" color="rgba(246,241,231,0.5)" mb={4}>Под капотом</Box>
              <Text fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1.1" maxW="480px">
                Не список ссылок, а{' '}
                <Box as="span" color="#E39B7C">готовый сценарий</Box>{' '}
                поездки
              </Text>
              <Text mt={5} color="rgba(246,241,231,0.68)" maxW="460px" lineHeight="1.75" fontSize="14px">
                Атлас не просто перечисляет достопримечательности. Он выстраивает их в маршрут, считает
                бюджет и оставляет место на спонтанность.
              </Text>
              <Box mt={8} display="grid" gap={3.5}>
                {[
                  'Бюджет распределён до рубля — с резервом',
                  'Отели подобраны под города и темп',
                  'Каждый день — со временем, локацией и смыслом',
                ].map((item) => (
                  <Flex key={item} align="center" gap={3}>
                    <Box w="22px" h="22px" borderRadius="50%" bg="rgba(201,111,74,0.22)" display="grid" placeItems="center" color="#E9B08F" flexShrink={0}>
                      <Icon name="check" size={12} />
                    </Box>
                    <Text fontSize="13px" color="rgba(246,241,231,0.86)">{item}</Text>
                  </Flex>
                ))}
              </Box>
            </Box>

            <Box position="relative" minH={{ base: '330px', md: '380px' }}>
              <Box
                position="absolute"
                right={{ base: 0, md: 4 }}
                top={{ base: 0, md: 6 }}
                w={{ base: '88%', md: '82%' }}
                bg="cream"
                color="ink"
                borderRadius="22px"
                boxShadow="0 24px 60px rgba(0,0,0,0.25)"
                p={5}
                transform="rotate(2.5deg)"
              >
                <Flex justify="space-between" align="center" mb={4}>
                  <Box>
                    <Text fontSize="9px" fontWeight={800} letterSpacing="0.14em" textTransform="uppercase" color="muted">День 3 · Кахетия</Text>
                    <Text fontFamily="heading" fontSize="lg" mt={1}>Переезд и вино</Text>
                  </Box>
                  <CountryMark country={{ id: 'georgia', palette: ['#E9B44C', '#C96F4A', '#315A4B'] }} size={34} />
                </Flex>
                <Box display="grid" gap={2.5}>
                  {[
                    ['10:30', 'Сигнахи и крепостная стена'],
                    ['14:00', 'Дегустация в Цинандали'],
                    ['20:00', 'Ужин на винодельне'],
                  ].map(([time, title]) => (
                    <Flex key={time} gap={3} align="flex-start">
                      <Text fontSize="10px" fontWeight={800} color="terracottaDark" w="38px" flexShrink={0} pt="1px">{time}</Text>
                      <Box w="7px" h="7px" borderRadius="50%" bg="sage" mt="5px" flexShrink={0} />
                      <Text fontSize="12px" fontWeight={600}>{title}</Text>
                    </Flex>
                  ))}
                </Box>
                <Box borderTop="1px solid var(--line)" mt={4} pt={3.5}>
                  <Flex justify="space-between" fontSize="11px">
                    <Text color="muted">Бюджет дня</Text>
                    <Text fontWeight={800}>8 200 ₽</Text>
                  </Flex>
                </Box>
              </Box>

              <Box
                position="absolute"
                left={{ base: 0, md: -6 }}
                bottom={{ base: 4, md: 10 }}
                w={{ base: '62%', md: '58%' }}
                bg="#FCF9F2"
                color="ink"
                borderRadius="18px"
                p={4}
                boxShadow="0 18px 46px rgba(0,0,0,0.22)"
                transform="rotate(-4deg)"
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontSize="9px" fontWeight={800} letterSpacing="0.12em" textTransform="uppercase" color="muted">Отель</Text>
                    <Text fontSize="13px" fontWeight={800} mt={1}>Lost Ridge Inn</Text>
                    <Text fontSize="10px" color="muted">Сигнахи · 4★</Text>
                  </Box>
                  <Box textAlign="right">
                    <Flex align="center" gap={1} justify="flex-end">
                      <Icon name="star" size={11} style={{ color: '#D9A441' }} />
                      <Text fontSize="12px" fontWeight={800}>9.4</Text>
                    </Flex>
                    <Text fontSize="10px" color="muted" mt={1}>10 400 ₽</Text>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  )
}
