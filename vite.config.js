import { resolve } from 'path'
import { readdirSync } from 'fs'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const pagesDir = resolve(__dirname, 'src/pages')
const pageFiles = readdirSync(pagesDir).filter(f => f.endsWith('.html'))

const input = {
  main: resolve(__dirname, 'index.html'),
}

pageFiles.forEach(file => {
  const name = file.replace('.html', '')
  input[name] = resolve(pagesDir, file)
})

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: { input }
  }
})