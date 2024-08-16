import { Context } from 'koa';
import { TokenSchema, Well } from '../models'
import { WellService } from '../services/well.service';

export const WellController = {
    async createWellByToken(ctx: Context) {
        const token = TokenSchema.parse(ctx.state.token);
        const userId = token.userId;

        const well: Well = await WellService.createWell(userId);

        ctx.status = 201
        ctx.body = { well }
    }
}