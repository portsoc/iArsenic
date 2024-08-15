import { ParameterizedContext, Next } from 'koa'
import config from '../config'

export default async function apiKeyOnly(
    ctx: ParameterizedContext,
    next: Next
) {
    // TODO store the API keys in a database
    const apiKey = ctx.request.headers['x-api-key']

    if (apiKey !== config.apiKey) {
        ctx.status = 401
        ctx.body = {
            error: true,
            result: 'Invalid API key',
        }
        return
    }

    await next()
}