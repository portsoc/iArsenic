import { ParameterizedContext, Next } from 'koa'
import { TokenRepo, UserRepo } from '../repositories'

export default async function adminOnly(
    ctx: ParameterizedContext,
    next: Next
) {
    const bearerAuth = ctx.request.headers['authorization'] as string
    const apiKey = ctx.request.headers['x-api-key'] as string

    let tokenId
    if (bearerAuth) tokenId = bearerAuth?.split(' ')[1]
    if (apiKey) tokenId = apiKey

    if (!tokenId) {
        ctx.state.auth = { user: { type: 'guest' } }

        await next()
        return
    }

    const token = await TokenRepo.findById(tokenId)

    if (token == null) {
        throw Error('token not found')
    }

    if (token.type !== 'access' && token.type !== 'api-key') {
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

    ctx.state.auth = { token, user }

    await next()
}