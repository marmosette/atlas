import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { type ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { Footer } from './Footer'
import { Navbar } from './Navbar'

export const ScrollManager = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const timer = window.setTimeout(() => {
        const element = document.getElementById(id)
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
      return () => window.clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
    return undefined
  }, [location.pathname, location.hash])

  return null
}

export const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
)

export const AppShell = ({ children }: { children: ReactNode }) => (
  <Box minH="100vh" display="flex" flexDirection="column">
    <Navbar />
    <Box as="main" flex="1">
      {children}
    </Box>
    <Footer />
  </Box>
)
