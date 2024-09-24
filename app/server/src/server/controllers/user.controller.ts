import { AccessToken, AccessTokenSchema, UserSchema, RegisterRequestSchema, LoginRequestSchema } from 'shared'
import { KnownError } from '../errors'
import { Context } from 'koa'
import { UserService } from '../services'

export const UserController = {
    async getUserByToken(ctx: Context): Promise<void> {
        const token = AccessTokenSchema.parse(ctx.state.token);
        const userId = token.userId;

        const user = await UserService.getById(userId);

        ctx.status = 200;
        ctx.body = { user };
    },

    async updateUserByToken(ctx: Context): Promise<void> {
        const token = AccessTokenSchema.parse(ctx.state.token);
        const userId = token.userId;

        if (!ctx.request.body) {
            throw new KnownError({
                message: 'Request body is required',
                code: 400,
                name: 'ValidationError',
            })
        }

        const userUpdateParseRes = UserSchema.partial().safeParse(
            JSON.parse(ctx.request.body as string)
        )

        if (!userUpdateParseRes.success) {
            throw new KnownError({
                message: userUpdateParseRes.error.message,
                code: 400,
                name: 'ValidationError',
            });
        }

        const userUpdates = userUpdateParseRes.data

        // Remove fields that should not be updated by user
        delete userUpdates.id
        delete userUpdates.email
        delete userUpdates.emailVerified
        delete userUpdates.type
        delete userUpdates.createdAt

        const updatedUser = await UserService.updateUser(
            userId,
            userUpdates,
        );

        const { password, ...user } = updatedUser;

        ctx.status = 200;
        ctx.body = { user };
    },

    async login(ctx: Context): Promise<void> {
        const loginRequestRes = LoginRequestSchema.safeParse(ctx.request.body)

        if (!loginRequestRes.success) {
            throw new KnownError({
                message: loginRequestRes.error.message,
                code: 400,
                name: 'ValidationError',
            });
        }

        const loginRequest = loginRequestRes.data

        const accessToken: AccessToken = await UserService.login(
            loginRequest.email,
            loginRequest.password,
        )

        ctx.status = 200
        ctx.body = { accessToken }
    },

    async register(ctx: Context): Promise<void> {
        const bodyParseRes = RegisterRequestSchema.safeParse(ctx.request.body)

        if (!bodyParseRes.success) {
            throw new KnownError({
                message: bodyParseRes.error.message,
                code: 400,
                name: 'ValidationError',
            });
        }

        const body = bodyParseRes.data

        await UserService.register(
            body.email,
            body.password,
            body.name,
            body.language,
            body.units,
        )

        ctx.status = 201
        ctx.body = { message: 'User created' }
    },

    async deleteUserByToken(ctx: Context): Promise<void> {
        ctx.status = 501
        ctx.body = { error: 'Not Implemented' }
    }
}