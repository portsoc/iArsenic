import Router from '@koa/router'
import v1 from './v1'

const routes = new Router()

// api root, use for server health checks
routes.get('/', async (ctx) => {
    ctx.status = 200
    ctx.body = {
        error: false,
        body: 'OK',
    }
})

// mount the sub routes
routes.use(v1.routes())

export default routes