import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export interface TocItem {
  id: string
  text: string
  level: number
}

export function useToc() {
  const location = useLocation()
  const [toc, setToc] = useState<TocItem[]>([])

  useEffect(() => {
    const headers = Array.from(
      document.querySelectorAll('main h2, main h3'),
    ) as HTMLHeadingElement[]

    const items = headers.map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: Number(el.tagName.replace('H', '')),
    }))

    setToc(items)
  }, [location.pathname])

  return toc
}
