import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

function parquetAcceptRanges(): Plugin {
  const mw = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url?.includes('.parquet')) res.setHeader('Accept-Ranges', 'bytes')
    next()
  }
  return {
    name: 'parquet-accept-ranges',
    configureServer(server) { server.middlewares.use(mw) },
    configurePreviewServer(server) { server.middlewares.use(mw) },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), parquetAcceptRanges()],
})
