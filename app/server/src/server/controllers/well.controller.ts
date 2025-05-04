import { Context } from 'koa';
import { AccessTokenSchema, GuestTokenSchema, Well, WellSchema, validateModel } from 'iarsenic-types'
import { WellService } from '../services/well.service';
import { KnownError } from '../errors';
import { z } from 'zod';

export const WellController = {
    async createWellByToken(ctx: Context) {
        const token = z.union([
            AccessTokenSchema,
            GuestTokenSchema,
        ]).parse(ctx.state.token);
        const userId = token.userId;

        const well: Well = await WellService.createWell(userId);

        ctx.status = 201
        ctx.body = { ...well }
    },

    // todo - add pagination
    async getAllWells(ctx: Context) {
        const wells = await WellService.getAllWells();

        ctx.status = 200
        ctx.body = { ...wells }
    },

    async getWellsByToken(ctx: Context) {
        const token = AccessTokenSchema.parse(ctx.state.token);
        const userId = token.userId;

        const wells = await WellService.getUserWells(userId);

        ctx.status = 200
        ctx.body = { wells }

    },

    async getWellByIdByToken(ctx: Context) {
        const token = z.union([
            AccessTokenSchema,
            GuestTokenSchema,
        ]).parse(ctx.state.token);

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
        ctx.body = { ...well }
    },

    async updateWellByIdByToken(ctx: Context) {
        const token = z.union([
            AccessTokenSchema,
            GuestTokenSchema,
        ]).parse(ctx.state.token);

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
        ctx.body = { ...updatedWell }
    },

    async deleteWellByIdByToken(ctx: Context) {
        ctx.status = 501
        ctx.body = { error: 'Not Implemented' }
    },

    async getImageUploadSignedUrl(ctx: Context) {
        const token = z.union([AccessTokenSchema, GuestTokenSchema])
            .parse(ctx.state.token);
        const userId = token.userId;
        const wellId = ctx.params.id;
    
        if (!wellId) {
            throw new KnownError({
                message: 'Well ID is required',
                code: 400,
                name: 'ValidationError',
            });
        }
    
        const body = ctx.request.body as { contentType?: string };
    
        if (!body.contentType || !body.contentType.startsWith('image/')) {
            throw new KnownError({
                message: 'Invalid or missing content type',
                code: 400,
                name: 'ValidationError',
            });
        }
    
        const { signedUrl, path } = await WellService.getImageUploadUrl({
            wellId,
            userId,
            contentType: body.contentType,
        });
    
        ctx.status = 200;
        ctx.body = { 
            url: signedUrl,
            path,
        };
    },

    async confirmWellImageUpload(ctx: Context) {
        const token = z.union([AccessTokenSchema, GuestTokenSchema])
            .parse(ctx.state.token);
        const userId = token.userId;
        const wellId = ctx.params.id;
    
        if (!wellId) {
            throw new KnownError({
                message: 'Well ID is required',
                code: 400,
                name: 'ValidationError',
            });
        }
    
        const body = ctx.request.body as { path?: string };

        if (!body.path || typeof body.path !== 'string') {
            throw new KnownError({
                message: 'Image path is required',
                code: 400,
                name: 'ValidationError',
            });
        }
    
        const updatedWell = await WellService.confirmImageUpload({
            wellId,
            userId,
            imagePath: body.path,
        });
    
        ctx.status = 200;
        ctx.body = { ...updatedWell };
    },

    async getWellImageUrls(ctx: Context) {
        const token = z.union([AccessTokenSchema, GuestTokenSchema]).parse(ctx.state.token);
        const userId = token.userId;
        const wellId = ctx.params.id;
    
        if (!wellId) {
            throw new KnownError({
                message: 'Well ID is required',
                code: 400,
                name: 'ValidationError',
            });
        }
    
        const urls = await WellService.getWellImageSignedUrls(wellId, userId);
    
        ctx.status = 200;
        ctx.body = { urls };
    },

    async deleteWellImage(ctx: Context) {
        const token = z.union([AccessTokenSchema, GuestTokenSchema]).parse(ctx.state.token);
        const userId = token.userId;
        const wellId = ctx.params.id;
    
        if (!wellId) {
            throw new KnownError({
                message: 'Well ID is required',
                code: 400,
                name: 'ValidationError',
            });
        }
    
        const { path } = ctx.request.body as { path?: string };
    
        if (!path || typeof path !== 'string') {
            throw new KnownError({
                message: 'Image path is required',
                code: 400,
                name: 'ValidationError',
            });
        }
    
        await WellService.deleteWellImage(wellId, userId, path);
    
        ctx.status = 200;
        ctx.body = { success: true };
    },

    async claimWells(ctx: Context) {
        const token = AccessTokenSchema.parse(ctx.state.token);
        const userId = token.userId;
    
        const { guestWellIds } = ctx.request.body as { guestWellIds?: string[] };

        if (!guestWellIds || !Array.isArray(guestWellIds)) {
            throw new KnownError({
                message: 'guestWellIds must be an array of well IDs',
                code: 400,
                name: 'ValidationError',
            });
        }
    
        const claimed = await WellService.claimGuestWells(
            userId, 
            guestWellIds,
        );
    
        ctx.status = 200;
        ctx.body = { ...claimed };
    },

    async getSelfWellsByQuery(ctx: Context) {
        const token = z.union(
            [AccessTokenSchema, GuestTokenSchema]
        ).parse(ctx.state.token);
        const userId = token.userId;
    
        const filters = {
            ...ctx.query,
            userId,
        };

        console.log('================================')
        console.log(filters)
    
        const predictions = await WellService.queryWells(filters);
    
        ctx.status = 200;
        ctx.body = { predictions };
    }
}