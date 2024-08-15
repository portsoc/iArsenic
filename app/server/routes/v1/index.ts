import { errorHandler } from '../../middleware'
import healthcheck from './healthcheck'
import login from './login'
import Router from '@koa/router'
import self from './self'
import user from './user'

const routes = new Router({ prefix: '/v1' })

// mount the middleware to apply to all of v1
routes.use(errorHandler)

// mount the sub routes
routes.use(healthcheck.routes())
routes.use(login.routes())
routes.use(user.routes())
routes.use(self.routes())

// health check endpoint
routes.get('/', async (ctx) => {
    ctx.status = 200
    ctx.body = {
        message: 'Hello from api /v1. Timestamp: ' + new Date().toISOString(),
    }
})

export default routes