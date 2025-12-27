import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { healthRoutes } from './routes/health'
import { rateLimiter } from 'hono-rate-limiter'
import { bodyLimit } from 'hono/body-limit'

export const app = new Hono()

// TODO: use data store for this
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each client to 100 requests per window
    keyGenerator: (c) => c.req.header('x-forwarded-for') ?? '', // Use IP address as key
  })
)

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }

  // oxlint-disable-next-line no-console
  console.error('[Unhandled Error]', err)

  return c.json({ error: 'Internal Server Error' }, 500)
})

app.use(
  '*',
  bodyLimit({
    maxSize: 100 * 1024, // 100kb
    onError: (c) => {
      return c.text('Payload too large', 413)
    },
  })
)

app.route('/health', healthRoutes)

app.get('/', (c) => {
  return c.json({
    name: 'QR Secure API',
    status: 'ok',
  })
})
