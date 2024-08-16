import { errorHandler } from '../../middleware'
import healthcheck from './healthcheck'
import Router from '@koa/router'
import self from './self'
import user from './user'

const routes = new Router({ prefix: '/api/v1' })

// mount the middleware to apply to all of v1
routes.use(errorHandler)

// mount the sub routes
routes.use(healthcheck.routes())
routes.use(user.routes())
routes.use(self.routes())

export default routes