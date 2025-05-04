import { ParameterizedContext, Next } from 'koa'
import { TokenRepo } from '../repositories'
import { KnownError } from '../errors'

export default async function jwtRequired (
    ctx: ParameterizedContext,
    next: Next,
) {
    const auth = ctx.request.headers['authorization'] as string
    const tokenId = auth?.split(' ')[1]

    if (!auth || !tokenId) {
        ctx.state.token = {
            userId: 'guest',
            type: 'guest',
        }

        await next()

        return
    }

    const token = await TokenRepo.findById(tokenId)

    if (token == null) {
        throw new Error('token not found');
    }

    if (token.type !== 'access') {
        throw Error('unexpected token type');
    }

    if (
        token.expiresAt < new Date() ||
        token.revokedAt != null
    ) {
        throw new KnownError({
            message: 'Token not valid',
            code: 401,
            name: 'UnauthorizedError',
        })
    }

    ctx.state.token = token

    await next()

    return
}