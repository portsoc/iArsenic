import { Context } from 'koa';
import { AbstractToken, AbstractTokenSchema } from 'iarsenic-types';
import { TokenService } from '../services/token.service';

export const TokenController = {
    async createApiKey(ctx: Context) {
        const token = AbstractTokenSchema.parse(ctx.state.token);

        const newApiKey: AbstractToken = await TokenService.createApiKey(
            token, 
        );

        ctx.status = 201;
        ctx.body = { ...newApiKey };
    },
}