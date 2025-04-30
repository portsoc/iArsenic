import { ParameterizedContext, Next } from 'koa';
import { TokenRepo, UserRepo } from '../repositories';

export default async function adminOnly(ctx: ParameterizedContext, next: Next) {
    const auth = ctx.request.headers['authorization'] as string | undefined;
    const apiKey = ctx.request.headers['x-api-key'] as string | undefined;

    const bearerToken = auth?.startsWith('Bearer ') ? auth.split(' ')[1] : undefined;
    const tokenId = bearerToken || apiKey;

    if (!tokenId) {
        ctx.status = 401;
        ctx.body = {
            error: true,
            result: 'Unauthorized: No token or API key provided',
        };
        return;
    }

    const token = await TokenRepo.findById(tokenId);

    if (!token) {
        ctx.status = 401;
        ctx.body = {
            error: true,
            result: 'Unauthorized: Invalid token',
        };
        return;
    }

    if (token.type !== 'access' && token.type !== 'api-key') {
        ctx.status = 401;
        ctx.body = {
            error: true,
            result: `Unauthorized: Unexpected token type "${token.type}"`,
        };
        return;
    }

    if (
        token.expiresAt < new Date() ||
        token.revokedAt != null
    ) {
        ctx.status = 401;
        ctx.body = {
            error: true,
            result: 'Unauthorized: Token expired or revoked',
        };
        return;
    }

    const user = await UserRepo.findById(token.userId);

    if (!user) {
        ctx.status = 401;
        ctx.body = {
            error: true,
            result: 'Unauthorized: User not found',
        };
        return;
    }

    if (user.type !== 'admin') {
        ctx.status = 401;
        ctx.body = {
            error: true,
            result: 'Unauthorized: User is not admin',
        };
        return;
    }

    ctx.state.token = token;
    ctx.state.user = user;

    await next();
}
