// src/components/Toc.tsx
import { useToc } from '@/hooks/useToc'
import { cn } from '@/utils/cn'

export default function Toc() {
  const toc = useToc()

  return (
    <nav className="fixed right-0 top-0 h-screen w-64 overflow-y-auto border-l p-6">
      <h2 className="mb-4 font-bold">On this page</h2>
      <ul className="space-y-2 text-sm">
        {toc.map((item) => (
          <li
            key={item.id}
            className={cn({
              'ml-0': item.level === 2,
              'ml-4': item.level === 3,
            })}
          >
            <a href={`#${item.id}`} className="text-blue-600 hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
