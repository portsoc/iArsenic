import Router from '@koa/router'

const user = new Router({ prefix: '/user' })

user.get('/', (ctx) => {
    ctx.status = 501
    ctx.body = {
        message: 'Not implemented',
    }

    return
});

export default user