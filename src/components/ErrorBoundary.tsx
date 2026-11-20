import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'

interface ErrorBoundaryState {
  hasError: boolean
  message?: string
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[atlas] UI error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box minH="100vh" bg="paper" display="grid" placeItems="center" px={5}>
          <Box maxW="480px" textAlign="center">
            <Text fontFamily="heading" fontSize="3xl" mb={3}>Что-то сбилось с маршрута</Text>
            <Text color="inkSoft" fontSize="14" lineHeight="1.7" mb={6}>
              Интерфейс столкнулся с неожиданной ошибкой. Обновите страницу — сохранённые поездки останутся на месте.
            </Text>
            <Flex gap={3} justify="center" wrap="wrap">
              <Button variant="accent" onClick={() => window.location.reload()}>Обновить страницу</Button>
              <Button variant="outline" onClick={() => { window.location.href = '/' }}>На главную</Button>
            </Flex>
            {this.state.message && (
              <Text mt={6} fontSize="10px" color="muted" fontFamily="mono">{this.state.message}</Text>
            )}
          </Box>
        </Box>
      )
    }
    return this.props.children
  }
}
