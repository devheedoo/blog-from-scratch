// src/components/Sidebar.tsx
import { Link } from 'react-router-dom'

import { pages } from '@/routes'

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white p-4">
      <h2 className="mb-4 text-lg font-bold">Docs</h2>
      <ul className="space-y-2">
        {pages.map(({ path, title }) => {
          return (
            <li key={path}>
              <Link to={path} className="text-blue-600 hover:underline">
                {title}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
