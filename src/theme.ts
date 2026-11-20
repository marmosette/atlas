import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const colors = {
  ink: '#16302B',
  inkSoft: '#2C463E',
  paper: '#F6F1E7',
  cream: '#FCF9F2',
  sand: '#EFE5D4',
  line: '#E3D7C5',
  terracotta: '#C96F4A',
  terracottaDark: '#A95434',
  gold: '#D9A441',
  sage: '#8FA08A',
  moss: '#3F6E63',
  muted: '#6C7A72',
  white: '#FFFFFF',
}

export const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#FBF0EA',
      100: '#F5D9CB',
      200: '#EDBCA5',
      300: '#E39B7C',
      400: '#D8835F',
      500: '#C96F4A',
      600: '#A95434',
      700: '#86402A',
      800: '#633020',
      900: '#432117',
    },
    ink: colors.ink,
    paper: colors.paper,
    cream: colors.cream,
    sand: colors.sand,
    line: colors.line,
    terracotta: colors.terracotta,
    terracottaDark: colors.terracottaDark,
    gold: colors.gold,
    sage: colors.sage,
    moss: colors.moss,
    muted: colors.muted,
  },
  fonts: {
    heading: "'Prata', 'Georgia', 'Times New Roman', serif",
    body: "'Manrope', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  fontSizes: {
    xs: '0.72rem',
    sm: '0.82rem',
    md: '0.95rem',
    lg: '1.05rem',
    xl: '1.2rem',
    '2xl': '1.5rem',
    '3xl': '1.9rem',
    '4xl': '2.4rem',
    '5xl': '3.1rem',
    '6xl': '4rem',
  },
  shadows: {
    soft: '0 1px 2px rgba(22, 48, 43, 0.04), 0 12px 36px rgba(22, 48, 43, 0.07)',
    card: '0 1px 1px rgba(22, 48, 43, 0.04), 0 16px 48px rgba(22, 48, 43, 0.09)',
    lift: '0 24px 70px rgba(22, 48, 43, 0.16)',
  },
  radii: {
    card: '24px',
    panel: '32px',
  },
  styles: {
    global: {
      body: {
        bg: 'paper',
        color: 'ink',
        fontFamily: 'body',
        WebkitFontSmoothing: 'antialiased',
        textRendering: 'optimizeLegibility',
      },
      '::selection': {
        background: '#E7B29A',
        color: '#16302B',
      },
      'a': {
        color: 'inherit',
      },
      'button, input, textarea, select': {
        fontFamily: 'inherit',
      },
      ':focus-visible': {
        outline: '2px solid #C96F4A',
        outlineOffset: '3px',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 600,
        borderRadius: '999px',
        letterSpacing: '0.01em',
      },
      variants: {
        solid: {
          bg: 'ink',
          color: 'paper',
          _hover: { bg: 'terracotta', transform: 'translateY(-1px)' },
          _active: { bg: 'terracottaDark' },
          transition: 'all .25s ease',
        },
        accent: {
          bg: 'terracotta',
          color: 'white',
          _hover: { bg: 'terracottaDark', transform: 'translateY(-1px)' },
          _active: { bg: 'terracottaDark' },
          transition: 'all .25s ease',
        },
        outline: {
          borderColor: 'line',
          color: 'ink',
          bg: 'transparent',
          _hover: { bg: 'sand', borderColor: 'ink' },
        },
        ghost: {
          color: 'ink',
          _hover: { bg: 'sand' },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'cream',
            borderColor: 'line',
            borderRadius: '14px',
            _hover: { borderColor: 'sage' },
            _focusVisible: { borderColor: 'terracotta', boxShadow: '0 0 0 1px #C96F4A' },
          },
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: 'ink',
        color: 'paper',
        borderRadius: '10px',
        fontSize: 'xs',
        px: 3,
        py: 2,
      },
    },
  },
})
