import './bootstrap'
import bodyParser from 'koa-bodyparser'
import config from './config'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import Koa from 'koa'
import routes from './routes'
import uuid4 from 'uuid4'

const api = new Koa()

api.use(async (ctx, next) => {
    const reqId = ctx.request.get('x-request-id') || uuid4()
    ctx.set('x-request-id', reqId)
    console.log(
        `${ctx.request.method} ${ctx.request.url} ${reqId}`
    )
    await next()
})

// middleware
api.use(cors())
api.use(bodyParser())
api.use(helmet())

// mount the routes
api.use(routes.routes())

// start the server
api.listen(config.port)
console.log(`server listening on port ${config.port}`)