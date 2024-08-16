import Router from '@koa/router'
import { UserController } from '../../controllers'

const user = new Router({ prefix: '/user' })

user.get('/', (ctx) => {
    ctx.status = 501
    ctx.body = {
        message: 'Not implemented',
    }

    return
});

user.post('/login', ctx => UserController.login(ctx));

export default user