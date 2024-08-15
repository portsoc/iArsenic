import Router from '@koa/router'

const prediction = new Router({ prefix: '/prediction' })

prediction.get('/', (ctx) => {
    ctx.status = 501
    ctx.body = {
        message: 'Not implemented',
    }

    return
});

export default prediction