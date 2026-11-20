import { Box, Flex, IconButton } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Icon } from '../ui/Icon'
import { Logo } from './Logo'

const links = [
  { label: 'Как это работает', to: '/#how' },
  { label: 'Направления', to: '/#destinations' },
  { label: 'Мои поездки', to: '/trips' },
]

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <Box
        as="header"
        position="sticky"
        top="0"
        zIndex={100}
        transition="background .3s ease, box-shadow .3s ease, border-color .3s ease"
        bg={scrolled ? 'rgba(246, 241, 231, 0.88)' : 'rgba(246, 241, 231, 0.28)'}
        backdropFilter="blur(18px)"
        borderBottom="1px solid"
        borderColor={scrolled ? 'line' : 'transparent'}
        className="no-print"
      >
        <Flex
          className="atlas-container"
          h={{ base: '68px', md: '78px' }}
          align="center"
          justify="space-between"
          gap={6}
        >
          <Logo />

          <Flex align="center" gap={8} display={{ base: 'none', lg: 'flex' }}>
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="link-underline"
                style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-soft)' }}
              >
                {link.label}
              </Link>
            ))}
          </Flex>

          <Flex align="center" gap={{ base: 2, md: 3 }}>
            <Link
              to="/#planner"
              className="atlas-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--ink)',
                color: 'var(--paper)',
                borderRadius: 999,
                padding: '11px 20px',
                fontSize: 13,
                fontWeight: 700,
                transition: 'background .25s ease, transform .25s ease',
              }}
            >
              <Icon name="sparkles" size={16} />
              <Box as="span" display={{ base: 'none', sm: 'inline' }}>
                Собрать маршрут
              </Box>
              <Box as="span" display={{ base: 'inline', sm: 'none' }}>
                Маршрут
              </Box>
            </Link>
            <IconButton
              aria-label="Открыть меню"
              icon={<Icon name="menu" size={22} />}
              variant="ghost"
              display={{ base: 'inline-flex', lg: 'none' }}
              onClick={() => setOpen(true)}
            />
          </Flex>
        </Flex>
      </Box>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: '#F6F1E7',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Flex
              className="atlas-container"
              h="68px"
              align="center"
              justify="space-between"
              borderBottom="1px solid var(--line)"
            >
              <Logo compact />
              <IconButton
                aria-label="Закрыть меню"
                icon={<Icon name="close" size={24} />}
                variant="ghost"
                onClick={() => setOpen(false)}
              />
            </Flex>
            <Flex direction="column" px={6} pt={10} gap={2}>
              {links.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 0',
                      borderBottom: '1px solid var(--line)',
                      fontFamily: "'Prata', Georgia, serif",
                      fontSize: 26,
                    }}
                  >
                    {link.label}
                    <Icon name="arrow-up-right" size={22} />
                  </Link>
                </motion.div>
              ))}
            </Flex>
            <Box mt="auto" p={6} color="var(--muted)" fontSize="sm">
              Атлас · путешествия, собранные ИИ
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
