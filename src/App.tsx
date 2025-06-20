import { MDXProvider } from '@mdx-js/react'
import { useRoutes } from 'react-router-dom'

import Counter from './components/Counter'
import Sidebar from './components/Sidebar'
import { pages } from './routes'

const components = {
  Counter,
}

export default function App() {
  const routes = useRoutes(
    pages.map(({ path, Component }) => ({
      path,
      element: (
        <MDXProvider components={components}>
          <Component />
        </MDXProvider>
      ),
    })),
  )

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full p-6">{routes}</main>
    </div>
  )
}
