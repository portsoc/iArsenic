import Router from '@koa/router'

const well = new Router({ prefix: '/well' })

well.get('/', (ctx) => {
    ctx.status = 501
    ctx.body = {
        message: 'Not implemented',
    }

    return
});

export default well