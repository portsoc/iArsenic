import { Context } from 'koa';
import { TokenSchema, Well, WellSchema, validateModel } from '../models'
import { WellService } from '../services/well.service';
import { KnownError } from '../errors';

export const WellController = {
    async createWellByToken(ctx: Context) {
        const token = TokenSchema.parse(ctx.state.token);
        const userId = token.userId;

        const well: Well = await WellService.createWell(userId);

        ctx.status = 201
        ctx.body = { well }
    },

    async getWellsByToken(ctx: Context) {
        const token = TokenSchema.parse(ctx.state.token);
        const userId = token.userId;

        const wells = await WellService.getUserWells(userId);

        ctx.status = 200
        ctx.body = { wells }

    },

    async getWellByIdByToken(ctx: Context) {
        const token = TokenSchema.parse(ctx.state.token);
        const userId = token.userId;

        const wellId = ctx.params.id;

        const well = await WellService.getWellById(wellId);

        if (!well) {
            ctx.status = 404
            ctx.body = { error: 'Not Found' }
        }

        const validatedWell = WellSchema.parse(well);

        if (validatedWell.userId !== userId) {
            ctx.status = 403
            ctx.body = { error: 'Unauthorized' }

            return
        }

        ctx.status = 200
        ctx.body = { well }
    },

    async updateWellByIdByToken(ctx: Context) {
        const token = TokenSchema.parse(ctx.state.token);
        const userId = token.userId;
        const wellId = ctx.params.id;

        const well = await WellService.getWellById(wellId);

        if (!well) {
            ctx.status = 404
            ctx.body = { error: 'Not Found' }

            return
        }

        if (well.userId !== userId) {
            ctx.status = 403
            ctx.body = { error: 'Unauthorized' }

            return
        }

        const result = validateModel(
            ctx.request.body,
            WellSchema.partial(),
        );

        if (!result.ok) {
            throw new KnownError({
                message: result.error.message,
                code: 400,
                name: 'ValidationError',
            });
        }

        const wellData = ctx.request.body as Partial<Well>

        delete wellData.id
        delete wellData.createdAt
        delete wellData.userId

        const updatedWell = await WellService.updateWell(
            wellId,
            wellData,
        );

        ctx.status = 200
        ctx.body = { well: updatedWell }
    },

    async deleteWellByIdByToken(ctx: Context) {
        ctx.status = 501
        ctx.body = { error: 'Not Implemented' }
    },

    async predictWellByIdByToken(ctx: Context) {
        ctx.status = 501
        ctx.body = { error: 'Not Implemented' }
    }
}