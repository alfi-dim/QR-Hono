import { Hono } from 'hono'
import { healthRoutes } from './routes/health.js'

export const app = new Hono()

app.route('/health', healthRoutes)

app.get('/', (c) => {
    return c.json({
        name: 'QR Secure API',
        status: 'ok',
    })
})