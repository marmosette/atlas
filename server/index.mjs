import path from 'node:path'
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

import express from 'express'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const isProd = process.argv.includes('--prod') || process.env.NODE_ENV === 'production'
const port = Number(process.env.PORT || 5173)
const host = process.env.HOST || '127.0.0.1'

const api = require(path.join(projectRoot, 'stubs', 'api', 'index.js'))

const app = express()
const httpServer = http.createServer(app)

app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store')
  }
  next()
})

app.use('/api', api)

if (isProd) {
  const dist = path.join(projectRoot, 'dist')
  app.use(
    express.static(dist, {
      index: false,
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache')
      },
    })
  )
  app.get('*', async (req, res, next) => {
    try {
      const html = await readFile(path.join(dist, 'index.html'), 'utf8')
      res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html)
    } catch (error) {
      next(error)
    }
  })
} else {
  const { createServer } = await import('vite')
  const vite = await createServer({
    root: projectRoot,
    server: {
      middlewareMode: true,
      hmr: { server: httpServer },
    },
    appType: 'custom',
  })

  app.use(vite.middlewares)
  app.use('*', async (req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      next()
      return
    }
    try {
      const template = await readFile(path.join(projectRoot, 'index.html'), 'utf8')
      const html = await vite.transformIndexHtml(req.originalUrl, template)
      res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(html)
    } catch (error) {
      vite.ssrFixStacktrace(error)
      next(error)
    }
  })
}

app.use((error, req, res, next) => {
  console.error('[atlas] server error:', error)
  if (res.headersSent) {
    next(error)
    return
  }
  res.status(500).json({ error: 'Внутренняя ошибка сервера' })
})

httpServer.listen(port, host, () => {
  const url = `http://${host}:${port}`
  console.log(`\n  Atlas is running → \x1b[36m${url}\x1b[0m`)
  console.log(`  API health      → \x1b[36m${url}/api/health\x1b[0m`)
  console.log(`  Mode            → ${isProd ? 'production' : 'development'}\n`)
})

const shutdown = () => {
  httpServer.close(() => process.exit(0))
  setTimeout(() => process.exit(0), 2500).unref()
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
