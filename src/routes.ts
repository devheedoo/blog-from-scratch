import type { ComponentType } from 'react'

import * as Welcome from './content/welcome.md'

type Page = {
  path: string
  Component: ComponentType
  meta: {
    title: string
    description?: string
    [key: string]: unknown
  }
}

export const pages: Page[] = [
  {
    path: '/',
    Component: Welcome.default,
    meta: Welcome.frontmatter,
  },
]
