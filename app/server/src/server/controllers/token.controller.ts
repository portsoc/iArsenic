import { Context } from 'koa';
import { AbstractToken } from 'iarsenic-types';
import { TokenService } from '../services/token.service';

export const TokenController = {
    async createApiKey(ctx: Context) {
        const auth = ctx.state.auth

        const newApiKey: AbstractToken = await TokenService.createApiKey(
            auth,
        );

        ctx.status = 201;
        ctx.body = { ...newApiKey };
    },
}