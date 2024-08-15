import Router from '@koa/router'

const self = new Router({ prefix: '/self' })

self.get('/', (ctx) => {
    ctx.status = 200
    ctx.body = {
        message: `Hello from /self. Timestamp: ${new Date().toISOString()}`,
    }

    return
});

export default self