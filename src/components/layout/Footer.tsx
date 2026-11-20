import { Box, Button, Flex, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { Icon } from '../ui/Icon'
import { Logo } from './Logo'

const columns = [
  {
    title: 'Сервис',
    links: [
      { label: 'Собрать маршрут', to: '/#planner' },
      { label: 'Как это работает', to: '/#how' },
      { label: 'Мои поездки', to: '/trips' },
    ],
  },
  {
    title: 'Направления',
    links: [
      { label: 'Грузия', to: '/#planner' },
      { label: 'Италия', to: '/#planner' },
      { label: 'Япония', to: '/#planner' },
    ],
  },
]

export const Footer = () => (
  <Box as="footer" className="no-print" mt={{ base: 20, md: 28 }}>
    <Box className="atlas-container">
      <Box
        className="grain-panel"
        bg="ink"
        color="paper"
        borderRadius={{ base: '24px', md: '36px' }}
        px={{ base: 6, md: 12, lg: 16 }}
        py={{ base: 10, md: 14 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          right="-60px"
          top="-80px"
          w="340px"
          h="340px"
          borderRadius="50%"
          border="1px dashed rgba(246,241,231,0.18)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          right="40px"
          bottom="-120px"
          w="260px"
          h="260px"
          borderRadius="50%"
          bg="rgba(201,111,74,0.18)"
          filter="blur(10px)"
          pointerEvents="none"
        />
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} position="relative">
          <Box>
            <Text className="eyebrow" color="rgba(246,241,231,0.55)" mb={4}>
              Следующая остановка
            </Text>
            <Text
              fontFamily="heading"
              fontSize={{ base: '4xl', md: '5xl' }}
              lineHeight="1.06"
              letterSpacing="-0.02em"
              maxW="520px"
            >
              Не откладывайте
              <br />
              <Box as="span" color="#E39B7C">
                хорошую поездку
              </Box>
            </Text>
            <Text mt={5} color="rgba(246,241,231,0.68)" maxW="440px" lineHeight="1.7">
              Укажите даты и бюджет — Атлас соберёт маршрут, отели и план на каждый день за пару минут.
            </Text>
            <Button
              as={Link}
              to="/#planner"
              mt={8}
              size="lg"
              variant="accent"
              rightIcon={<Icon name="arrow-right" size={18} />}
            >
              Собрать путешествие
            </Button>
          </Box>

          <SimpleGrid columns={2} spacing={{ base: 8, md: 10 }} alignContent="start" pt={{ base: 4, lg: 2 }}>
            {columns.map((column) => (
              <Stack key={column.title} spacing={3.5}>
                <Text fontSize="11px" fontWeight={700} letterSpacing="0.16em" textTransform="uppercase" color="rgba(246,241,231,0.45)">
                  {column.title}
                </Text>
                {column.links.map((link) => (
                  <Link key={link.label} to={link.to} style={{ color: 'rgba(246,241,231,0.82)', fontSize: 14 }}>
                    {link.label}
                  </Link>
                ))}
              </Stack>
            ))}
            <Stack spacing={3.5}>
              <Text fontSize="11px" fontWeight={700} letterSpacing="0.16em" textTransform="uppercase" color="rgba(246,241,231,0.45)">
                Технологии
              </Text>
              <Text color="rgba(246,241,231,0.82)" fontSize={14}>GigaChat + LangChain</Text>
              <Text color="rgba(246,241,231,0.82)" fontSize={14}>React · Redux · Chakra</Text>
              <Text color="rgba(246,241,231,0.82)" fontSize={14}>BroJS CLI</Text>
            </Stack>
            <Stack spacing={3.5}>
              <Text fontSize="11px" fontWeight={700} letterSpacing="0.16em" textTransform="uppercase" color="rgba(246,241,231,0.45)">
                О проекте
              </Text>
              <Text color="rgba(246,241,231,0.82)" fontSize={14}>Демо-сервис</Text>
              <Text color="rgba(246,241,231,0.82)" fontSize={14}>Цены ориентировочные</Text>
              <Text color="rgba(246,241,231,0.82)" fontSize={14}>2026</Text>
            </Stack>
          </SimpleGrid>
        </SimpleGrid>

        <Flex
          mt={{ base: 10, md: 14 }}
          pt={6}
          borderTop="1px solid rgba(246,241,231,0.14)"
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          gap={4}
          direction={{ base: 'column', md: 'row' }}
        >
          <Logo light />
          <Text fontSize="xs" color="rgba(246,241,231,0.45)">
            © 2026 Атлас. Путешествия, собранные со смыслом.
          </Text>
        </Flex>
      </Box>
    </Box>
  </Box>
)
