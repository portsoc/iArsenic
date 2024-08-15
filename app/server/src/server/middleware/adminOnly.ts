import { ParameterizedContext, Next } from 'koa'

export default async function adminOnly(
    ctx: ParameterizedContext,
    next: Next
) {
    const jwt = ctx.request.headers['authorization']

    // get JWT from database

    // get user id from database using jwt

    if (!jwt) {
        ctx.status = 401
        ctx.body = {
            error: true,
            result: 'Invalid API key',
        }
        return
    }

    await next()
}