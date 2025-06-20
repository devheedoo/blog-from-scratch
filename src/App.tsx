import { MDXProvider } from '@mdx-js/react'
import { Route, Routes } from 'react-router-dom'

import Counter from './components/Counter'
import Intro from './content/intro.mdx'

const components = {
  Counter,
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MDXProvider components={components}>
            <Intro />
          </MDXProvider>
        }
      />
    </Routes>
  )
}
