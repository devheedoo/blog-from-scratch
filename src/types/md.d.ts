declare module '*.md' {
  import { ComponentType } from 'react'

  const Component: ComponentType
  export default Component

  export const frontmatter: {
    title: string
    description?: string
    [key: string]: unknown
  }
}
