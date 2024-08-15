import bodyParser, { Options } from 'koa-bodyparser';
import { Context } from 'koa';

// https://github.com/koajs/bodyparser/issues/127
export default function hybridBodyParser(opts?: Options) {
    const bp = bodyParser(opts);

    return async function(ctx: Context, next: () => Promise<void>) {
        // @ts-ignore
        ctx.request.body = ctx.request.body || ctx.req.body
        return bp(ctx, next);
    };
}
