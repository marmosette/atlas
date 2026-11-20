import { Box, Flex, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  description?: string
  right?: ReactNode
  id?: string
}

export const SectionHeading = ({ eyebrow, title, description, right, id }: SectionHeadingProps) => (
  <Flex
    id={id}
    justify="space-between"
    align={{ base: 'flex-start', md: 'flex-end' }}
    gap={6}
    direction={{ base: 'column', md: 'row' }}
    mb={{ base: 6, md: 8 }}
    scrollMarginTop="130px"
  >
    <Box>
      <Box className="eyebrow" mb={3}>{eyebrow}</Box>
      <Text as="h2" className="display-title" fontSize={{ base: '2xl', md: '3xl' }} maxW="640px">
        {title}
      </Text>
      {description && (
        <Text mt={3} color="inkSoft" fontSize="14px" lineHeight="1.7" maxW="560px">
          {description}
        </Text>
      )}
    </Box>
    {right}
  </Flex>
)

export const SectionShell = ({ id, children }: { id?: string; children: ReactNode }) => (
  <Box id={id} className="atlas-container" mt={{ base: 16, md: 22 }} scrollMarginTop="130px">
    {children}
  </Box>
)
