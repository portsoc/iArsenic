import { Context } from 'koa';
import { TokenSchema, Well, WellSchema, validateModel } from 'shared'
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

        if (!wellId) {
            throw new KnownError({
                message: 'Well ID is required',
                code: 400,
                name: 'ValidationError',
            })
        }

        const well: Well = await WellService.getWellById(wellId, userId);

        ctx.status = 200
        ctx.body = { well }
    },

    async updateWellByIdByToken(ctx: Context) {
        const token = TokenSchema.parse(ctx.state.token);
        const userId = token.userId;
        const wellId = ctx.params.id;

        if (!wellId) {
            throw new KnownError({
                message: 'Well ID is required',
                code: 400,
                name: 'ValidationError',
            })
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
            userId,
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
        const token = TokenSchema.parse(ctx.state.token);
        const userId = token.userId;
        const wellId = ctx.params.id;

        if (!wellId) {
            ctx.status = 400
            ctx.body = { error: 'Well ID is required' }

            return
        }

        const wellWithPrediction = await WellService.generateEstimate(userId, wellId);

        ctx.status = 200
        ctx.body = { well: wellWithPrediction }
    }
}