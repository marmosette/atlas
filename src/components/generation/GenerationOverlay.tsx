import { Box, Flex, Text } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { useAppSelector } from '../../store/hooks'
import { formatDateRange, formatMoney, getDuration } from '../../utils/format'
import { Icon, type IconName } from '../ui/Icon'

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'compass', title: 'Читаем пожелания', text: 'Смотрим на даты, бюджет и то, что вы любите.' },
  { icon: 'globe', title: 'Сравниваем города', text: 'Сезон, логистика и время на дорогу между ними.' },
  { icon: 'bed', title: 'Подбираем отели', text: 'Ищем варианты под бюджет и локацию.' },
  { icon: 'wallet', title: 'Распределяем бюджет', text: 'Проживание, еда, дорога и впечатления.' },
  { icon: 'route', title: 'Собираем маршрут', text: 'Расписываем каждый день по часам.' },
]

export const GenerationOverlay = () => {
  const status = useAppSelector((state) => state.generation.status)
  const draft = useAppSelector((state) => state.planner.draft)
  const [step, setStep] = useState(0)
  const open = status === 'loading'

  useEffect(() => {
    if (!open) {
      setStep(0)
      return undefined
    }
    document.body.style.overflow = 'hidden'
    const interval = window.setInterval(() => {
      setStep((current) => (current + 1) % STEPS.length)
    }, 2600)
    return () => {
      document.body.style.overflow = ''
      window.clearInterval(interval)
    }
  }, [open])

  const duration = getDuration(draft.startDate, draft.endDate)
  const current = STEPS[step]
  const progress = Math.min(94, 12 + step * 17)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            background: '#122722',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          role="status"
          aria-live="polite"
        >
          <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none">
            <Box
              position="absolute"
              top="50%"
              left="50%"
              w={{ base: '640px', md: '900px' }}
              h={{ base: '640px', md: '900px' }}
              borderRadius="50%"
              border="1px solid rgba(246,241,231,0.08)"
              transform="translate(-50%, -50%)"
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              w={{ base: '440px', md: '620px' }}
              h={{ base: '440px', md: '620px' }}
              borderRadius="50%"
              border="1px dashed rgba(201,111,74,0.3)"
              transform="translate(-50%, -50%)"
              style={{ animation: 'spin-slow 40s linear infinite' }}
            />
            <Box
              position="absolute"
              top="-20%"
              right="-10%"
              w="520px"
              h="520px"
              borderRadius="50%"
              bg="radial-gradient(circle, rgba(201,111,74,0.25), rgba(201,111,74,0) 65%)"
            />
            <svg viewBox="0 0 1200 800" width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
              <path d="M-40 620C160 520 280 660 480 580s260-180 440-80 220 40 320-60" fill="none" stroke="#C96F4A" strokeWidth="1" strokeDasharray="4 10" />
              <path d="M-40 560C200 470 280 600 520 520s240-160 420-70 200 50 300-40" fill="none" stroke="#F6F1E7" strokeWidth="0.8" strokeDasharray="3 12" opacity="0.4" />
            </svg>
          </Box>

          <Box
            as={motion.div}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            position="relative"
            w="100%"
            maxW="500px"
            bg="cream"
            borderRadius={{ base: '24px', md: '30px' }}
            p={{ base: 6, md: 8 }}
            boxShadow="0 40px 100px rgba(0,0,0,0.4)"
          >
            <Flex justify="space-between" align="center" mb={7}>
              <Flex align="center" gap={2}>
                <Box w="8px" h="8px" borderRadius="50%" bg="terracotta" position="relative">
                  <Box position="absolute" inset="-6px" borderRadius="50%" border="1px solid #C96F4A" style={{ animation: 'pulse-ring 1.8s ease-out infinite' }} />
                </Box>
                <Text fontSize="9px" fontWeight={800} letterSpacing="0.16em" textTransform="uppercase" color="muted">
                  Атлас собирает маршрут
                </Text>
              </Flex>
              <Text fontFamily="heading" fontSize="sm" color="muted">AI</Text>
            </Flex>

            <Box minH="160px">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28 }}
                >
                  <Flex
                    w="52px"
                    h="52px"
                    borderRadius="16px"
                    bg="ink"
                    color="paper"
                    align="center"
                    justify="center"
                    mb={5}
                  >
                    <Icon name={current.icon} size={24} />
                  </Flex>
                  <Text fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} lineHeight="1.15">
                    {current.title}
                  </Text>
                  <Text mt={2.5} color="inkSoft" fontSize="13px" lineHeight="1.65">
                    {current.text}
                  </Text>
                </motion.div>
              </AnimatePresence>
            </Box>

            <Box mt={5} h="4px" bg="paper" borderRadius="999px" overflow="hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ height: '100%', background: '#C96F4A', borderRadius: 999 }}
              />
            </Box>

            <Flex mt={5} pt={5} borderTop="1px solid" borderColor="line" gap={2} wrap="wrap">
              <Box bg="paper" border="1px solid" borderColor="line" borderRadius="999px" px={2.5} py={1} fontSize="10px" fontWeight={600}>
                {draft.country === 'surprise' ? 'Удивите меня' : 'Направление выбрано'}
              </Box>
              {draft.startDate && draft.endDate && (
                <Box bg="paper" border="1px solid" borderColor="line" borderRadius="999px" px={2.5} py={1} fontSize="10px" fontWeight={600}>
                  {formatDateRange(draft.startDate, draft.endDate)} · {duration} дн.
                </Box>
              )}
              <Box bg="paper" border="1px solid" borderColor="line" borderRadius="999px" px={2.5} py={1} fontSize="10px" fontWeight={600}>
                {formatMoney(draft.budget)} ₽
              </Box>
            </Flex>

            <Text mt={5} fontSize="10px" color="muted">
              Обычно это занимает 20–40 секунд. Не закрывайте страницу.
            </Text>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
