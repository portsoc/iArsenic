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
user.post('/register', ctx => UserController.register(ctx));
user.get('/verify-email/:token', ctx => UserController.verifyEmail(ctx));
user.post('/forgot-password', ctx => UserController.forgotPassword(ctx));
user.post('/reset-password/:token', ctx => UserController.resetPassword(ctx));

export default user