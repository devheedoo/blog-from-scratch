import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import Markdown from 'vite-plugin-md'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: [/\.tsx?$/, /\.md$/],
    }),
    Markdown(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
