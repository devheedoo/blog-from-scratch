import { MDXProvider } from '@mdx-js/react'
import { useRoutes } from 'react-router-dom'

import Counter from '@/components/Counter'
import Sidebar from '@/components/Sidebar'
import Toc from '@/components/Toc'
import { pages } from '@/routes'
import { createHeadingComponents } from '@/utils/createHeadingComponent'

export default function App() {
  const routes = useRoutes(
    pages.map(({ path, Component }) => ({
      path,
      element: <Component key={path} />,
    })),
  )

  const components = {
    Counter,
    ...createHeadingComponents(),
  }

  return (
    <MDXProvider components={components}>
      <div className="flex">
        <Sidebar />
        <main className="ml-64 w-full p-6">{routes}</main>
        <Toc />
      </div>
    </MDXProvider>
  )
}
