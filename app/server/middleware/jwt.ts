import { ParameterizedContext, Next } from 'koa'

export default async function apiKeyOrJwt(
    ctx: ParameterizedContext,
    next: Next
) {
    const jwt = ctx.request.headers['authorization']

    // get JWT from database

    // if jwt valid go to next

    // else throw known error

    await next()

    return
}