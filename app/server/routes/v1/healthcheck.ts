import Router from '@koa/router'

const healthcheck = new Router({ prefix: '/healthcheck' })

healthcheck.get('/', (ctx) => {
    ctx.status = 200
    ctx.body = {
        message: `Server is running. Timestamp: ${new Date().toISOString()}`,
    }

    return
});

export default healthcheck