import Router from '@koa/router'
import UserRepo from '../../repository/user.repo';
import { z } from 'zod'

const loginRequestSchema = z.object({
    email: z.string(),
    password: z.string(),
});

const login = new Router({ prefix: '/login' })

login.get('/', async ctx => {
    const body = loginRequestSchema.parse(ctx.request.body)

    const email = body.email
    // const password = body.password

    const userRepo = new UserRepo()
    const user = await userRepo.findByEmail(email)

    console.log(user)

    if (!user) {
        ctx.status = 404
        ctx.body = {
            message: 'User not found',
        }

        return
    }

    ctx.status = 501
    ctx.body = {
        message: 'Not implemented',
    }

    return
});

export default login