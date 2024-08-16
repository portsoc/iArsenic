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

const RegisterRequestSchema = z.object({
    email: z.string(),
    password: z.string(),
    name: z.string(),
})

type RegisterRequest = z.infer<typeof RegisterRequestSchema>

export const UserController = {

    async login(ctx: Context): Promise<void> {
        const result = validateModel(ctx.request.body, LoginRequestSchema)

        if (!result.ok) {
            throw new KnownError({
                message: result.error.message,
                code: 400,
                name: 'ValidationError',
            });
        }

        const body = ctx.request.body as LoginRequest

        const accessToken: Token = await UserService.login(
            body.email,
            body.password,
        )

        ctx.status = 200
        ctx.body = { accessToken }
    },

    async register(ctx: Context): Promise<void> {
        const result = validateModel(ctx.request.body, RegisterRequestSchema)

        if (!result.ok) {
            throw new KnownError({
                message: result.error.message,
                code: 400,
                name: 'ValidationError',
            });
        }

        const body = ctx.request.body as RegisterRequest

        await UserService.register(
            body.email,
            body.password,
            body.name,
        )

        ctx.status = 201
        ctx.body = { message: 'User created' }
    }
}