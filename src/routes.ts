import type { ComponentType } from 'react'

interface MdxModule {
  default: ComponentType
  frontmatter?: {
    title?: string
    [key: string]: unknown
  }
}

export const pages = Object.entries(
  import.meta.glob('./content/**/*.mdx', { eager: true }),
).map(([filePath, modRaw]) => {
  const mod = modRaw as MdxModule

  const slug = filePath
    .replace('./content', '')
    .replace(/\/index\.mdx$/, '/')
    .replace(/\.mdx$/, '')

  return {
    path: slug || '/',
    Component: mod.default,
    title: mod.frontmatter?.title || slug.split('/').pop(),
  }
})
