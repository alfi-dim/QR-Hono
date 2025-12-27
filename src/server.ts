import { serve } from '@hono/node-server'
import { app } from './app.js'
import { env } from './config/env.js'

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  () => {
    // oxlint-disable-next-line no-console
    console.log(`🚀 API running on http://localhost:${env.PORT}`)
  }
)

process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      // oxlint-disable-next-line no-console
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})

export default server
