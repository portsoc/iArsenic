import { validateModel, Token } from '../models'
import { KnownError } from '../errors'
import { z } from 'zod'
import { Context } from 'koa'
import { UserService } from '../services'

const LoginRequestSchema = z.object({
    email: z.string(),
    password: z.string(),
})

type LoginRequest = z.infer<typeof LoginRequestSchema>

export const UserController = {

    async login(ctx: Context): Promise<void> {
        const body: LoginRequest = LoginRequestSchema.parse(ctx.request.body)
        const result = validateModel(body, LoginRequestSchema)

        if (!result.ok) {
            throw new KnownError({
                message: result.error.message,
                code: 400,
                name: 'ValidationError',
            });
        }

       const accessToken: Token = await UserService.login(body.email, body.password)
       console.log(accessToken)

       ctx.status = 200
       ctx.body = { accessToken }
    }
}