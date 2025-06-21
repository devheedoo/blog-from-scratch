import { useRoutes } from 'react-router-dom'

import Sidebar from '@/components/Sidebar'
import Toc from '@/components/Toc'
import { pages } from '@/routes'

export default function App() {
  const routes = useRoutes(
    pages.map(({ path, Component }) => ({
      path,
      element: <Component key={path} />,
    })),
  )

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full p-6">{routes}</main>
      <Toc />
    </div>
  )
}
