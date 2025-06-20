import { createElement } from 'react'

import { createSlug } from '@/utils/createSlug'

const tagMap = {
  2: 'h2',
  3: 'h3',
} as const

type HeadingLevel = keyof typeof tagMap

export function createHeadingComponents() {
  const usedIds = new Map<string, number>()

  const renderHeading = (level: HeadingLevel) => {
    return ({ children }: { children: React.ReactNode }) => {
      const raw = children?.toString() || ''
      const baseId = createSlug(raw)

      const count = usedIds.get(baseId) || 0
      usedIds.set(baseId, count + 1)

      const id = count === 0 ? baseId : `${baseId}-${count}`
      const Tag = tagMap[level]

      return createElement(Tag, { id }, children)
    }
  }

  return {
    h2: renderHeading(2),
    h3: renderHeading(3),
  }
}
