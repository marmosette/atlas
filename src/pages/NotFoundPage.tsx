import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { DestinationArt } from '../components/art/DestinationArt'
import { Icon } from '../components/ui/Icon'

export const NotFoundPage = () => (
  <Box className="atlas-container" pt={{ base: 12, md: 20 }} pb={20}>
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: '1.1fr 0.9fr' }}
      gap={{ base: 8, lg: 10 }}
      alignItems="center"
      bg="cream"
      border="1px solid"
      borderColor="line"
      borderRadius={{ base: '24px', md: '32px' }}
      overflow="hidden"
    >
      <Box p={{ base: 7, md: 11 }}>
        <Box className="eyebrow" mb={4}>Ошибка 404</Box>
        <Text fontFamily="heading" fontSize={{ base: '5xl', md: '6xl' }} lineHeight="1" color="terracotta">
          404
        </Text>
        <Text fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1.1" mt={4}>
          Страница ушла
          <br />
          в путешествие
        </Text>
        <Text mt={4} color="inkSoft" fontSize="14px" lineHeight="1.7" maxW="420px">
          Такого адреса нет — возможно, ссылка устарела. Зато есть 16 направлений, из которых можно собрать новую поездку.
        </Text>
        <Flex gap={3} mt={7} wrap="wrap">
          <Button as={Link} to="/" variant="accent" rightIcon={<Icon name="arrow-right" size={16} />}>
            На главную
          </Button>
          <Button as={Link} to="/#planner" variant="outline">
            Собрать маршрут
          </Button>
        </Flex>
      </Box>
      <Box position="relative" minH={{ base: '220px', lg: '420px' }}>
        <DestinationArt scene="mountains" palette={['#E9B44C', '#C96F4A', '#315A4B']} />
        <Box position="absolute" inset={0} bg="linear-gradient(90deg, #FCF9F2 0%, rgba(252,249,242,0) 32%)" />
      </Box>
    </Box>
  </Box>
)
