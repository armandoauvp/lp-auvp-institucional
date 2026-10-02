import { defineConfig } from 'vite'
import { partytownVite } from '@qwik.dev/partytown/utils'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const basePath = process.env.BASE_PATH || '/'
const outDir = process.env.BUILD_OUT_DIR || 'docs'

export default defineConfig({
  base: basePath,
  build: {
    outDir,
    // Prevent deleting the static export when publishing outside this project.
    emptyOutDir: false,
  },
  plugins: [
    partytownVite({
      dest: path.resolve(__dirname, outDir, '~partytown'),
    }),
  ],
})
