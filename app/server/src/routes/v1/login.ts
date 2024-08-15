import Router from '@koa/router'

const login = new Router({ prefix: '/login' })

login.get('/', (ctx) => {
    ctx.status = 501
    ctx.body = {
        message: 'Not implemented',
    }

    return
});

export default login