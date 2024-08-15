import { Context } from 'koa'
import { KnownError } from '../errors'

const logError = ({
    caughtError,
    body,
}: {
    caughtError: unknown
    body: Record<string, boolean | number | string>
}) => {
    console.error('> errorHandler', { ...body, caughtError })
}

export default async function errorHandler(ctx: Context, next: () => Promise<void>) {
    const reqId = ctx.response.get('x-request-id')
    try {
        await next()
    } catch (error) {
        const body = {
            error: true,
            requestId: reqId,
            knownError: false,
            name: '',
            message: '',
        }

        if (error instanceof KnownError) {
            /**
             * A KnownError is one we have accounted for and therefore would have thought about
             * the messaging. We pass this recognition onto the client via this variable being true
             */
            body.knownError = true
            body.name = error.name
            body.message = error.message

            logError({ caughtError: error, body })

            ctx.status = error.code
            ctx.body = body
            return
        } else {
            body.message = 'internal server error'
            body.knownError = false
        }

        logError({ caughtError: error, body })
        ctx.status = 500
        ctx.body = body
    }
}