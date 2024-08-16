import { ParameterizedContext, Next } from 'koa'
import { TokenRepo } from '../repositories'

export default async function jwtRequired (
    ctx: ParameterizedContext,
    next: Next
) {
    const auth = ctx.request.headers['authorization'] as string
    const tokenId = auth?.split(' ')[1]

    if (!auth || !tokenId) {
        ctx.status = 401
        ctx.body = {
            message: 'Unauthorized',
        }

        return
    }

    const token = await TokenRepo.findById(tokenId)

    if (
        token == null ||
        token.expiresAt < new Date() ||
        token.type !== 'access' ||
        token.revokedAt != null
    ) {
        ctx.status = 401
        ctx.body = {
            message: 'Unauthorized',
        }

        return
    }

    ctx.state.token = token

    await next()

    return
}