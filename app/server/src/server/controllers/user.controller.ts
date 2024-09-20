import { validateModel, Token, TokenSchema, UserSchema, User } from 'shared'
import { KnownError } from '../errors'
import { z } from 'zod'
import { Context } from 'koa'
import { UserService } from '../services'
import { UserRepo } from '../repositories'

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
    async getUserByToken(ctx: Context): Promise<void> {
        const token = TokenSchema.parse(ctx.state.token);
        const userId = token.userId;

        const userRes = await UserRepo.findById(userId);

        if (userRes == null) {
            throw new KnownError({
                message: 'UserId on JWT not found',
                code: 404,
                name: 'UserNotFoundError',
            });
        }

        const { password, ...user } = userRes;

        ctx.status = 200;
        ctx.body = { user };
    },

    async updateUserByToken(ctx: Context): Promise<void> {
        const token = TokenSchema.parse(ctx.state.token);
        const userId = token.userId;

        const result = validateModel(ctx.request.body, UserSchema.partial());

        if (!result.ok) {
            throw new KnownError({
                message: result.error.message,
                code: 400,
                name: 'ValidationError',
            });
        }

        const body = ctx.request.body as Partial<User>

        // Remove fields that should not be updated by user
        delete body.id
        delete body.email
        delete body.emailVerified
        delete body.type
        delete body.createdAt

        const updatedUser = await UserService.updateUser(
            userId,
            body,
        );

        const { password, ...user } = updatedUser;

        ctx.status = 200;
        ctx.body = { user };
    },

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
    },

    async deleteUserByToken(ctx: Context): Promise<void> {
        ctx.status = 501
        ctx.body = { error: 'Not Implemented' }
    }
}