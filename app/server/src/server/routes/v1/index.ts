import { errorHandler } from '../../middleware'
import healthcheck from './healthcheck'
import Router from '@koa/router'
import self from './self'
import user from './user'
import well from './well'
import prediction from './prediction'
import geodata from './geodata'

const routes = new Router({ prefix: '/api/v1' })

// mount the middleware to apply to all of v1
routes.use(errorHandler)

// mount the sub routes
routes.use(healthcheck.routes())
routes.use(user.routes())
routes.use(self.routes())
routes.use(well.routes())
routes.use(prediction.routes())
routes.use(geodata.routes())

export default routes