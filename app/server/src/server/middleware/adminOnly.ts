import { ParameterizedContext, Next } from 'koa'
import { TokenRepo, UserRepo } from '../repositories'

export default async function adminOnly(
    ctx: ParameterizedContext,
    next: Next
) {
    const auth = ctx.request.headers['authorization'] as string
    const tokenId = auth?.split(' ')[1]

    if (!auth || !tokenId) {
        ctx.status = 401
        ctx.body = {
            error: true,
            result: 'Unauthorized',
        }
        return
    }

    const token = await TokenRepo.findById(tokenId)

    if (token == null) {
        throw Error('token not found')
    }

    if (token.type !== 'access') {
        throw Error('unexpected token type')
    }

    if (
        token.expiresAt < new Date() ||
        token.revokedAt != null
    ) {
        ctx.status = 401
        ctx.body = {
            error: true,
            result: 'Unauthorized',
        }
        return
    }

    const user = await UserRepo.findById(token.userId)

    if (!user) {
        throw Error('user not found')
    }

    if (user.type !== 'admin') {
        ctx.status = 401
        ctx.body = {
            error: true,
            result: 'Unauthorized',
        }

        return
    }

    ctx.state.token = token

    await next()
}