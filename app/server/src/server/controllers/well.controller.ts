import { Context } from 'koa';
import { AbstractTokenSchema, UserSchema, Well, WellSchema, validateModel } from 'iarsenic-types'
import { WellService } from '../services/well.service';
import { KnownError } from '../errors';

export const WellController = {
    async createWell(ctx: Context) {
        const auth = ctx.state.auth

        const well: Well = await WellService.createWell(
            auth,
        );

        ctx.status = 201
        ctx.body = { ...well }
    },

    // todo - add pagination
    async getAllWells(ctx: Context) {
        const auth = ctx.state.auth

        if (auth.user.type !== 'admin') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        const wells = await WellService.getAllWells();

        ctx.status = 200
        ctx.body = { wells }
    },

    async getWellsByToken(ctx: Context) {
        const auth = ctx.state.auth

        if (auth.user.type === 'guest') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        const token = AbstractTokenSchema.parse(auth.token);

        if (token.type !== 'api-key' && token.type !== 'access') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });

        }

        const userId = token.userId;
        const wells = await WellService.getUserWells(userId);

        ctx.status = 200
        ctx.body = { wells }

    },

    async getWellById(ctx: Context) {
        const auth = ctx.state.auth
        const wellId = ctx.params.id;

        if (!wellId) {
            throw new KnownError({
                message: 'Well ID is required',
                code: 400,
                name: 'ValidationError',
            })
        }

        const well: Well = await WellService.getWellById(
            auth,
            wellId, 
        );

        ctx.status = 200
        ctx.body = { ...well }
    },

    async updateWellByIdByToken(ctx: Context) {
        const auth = ctx.state.auth
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
            auth,
            wellId,
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
        const auth = ctx.state.auth

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
    
        const { signedUrl, path } = await WellService.getImageUploadUrl(
            auth,
            wellId,
            body.contentType,
        );
    
        ctx.status = 200;
        ctx.body = { 
            url: signedUrl,
            path,
        };
    },

    async confirmWellImageUpload(ctx: Context) {
        const auth = ctx.state.auth
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
    
        const updatedWell = await WellService.confirmImageUpload(
            auth,
            wellId,
            body.path,
        );
    
        ctx.status = 200;
        ctx.body = { ...updatedWell };
    },

    async getWellImageUrls(ctx: Context) {
        const auth = ctx.state.auth

        const wellId = ctx.params.id;
    
        if (!wellId) {
            throw new KnownError({
                message: 'Well ID is required',
                code: 400,
                name: 'ValidationError',
            });
        }
    
        const urls = await WellService.getWellImageSignedUrls(
            auth,
            wellId, 
        );
    
        ctx.status = 200;
        ctx.body = { urls };
    },

    async deleteWellImage(ctx: Context) {
        const auth = ctx.state.auth
        const wellId = ctx.params.id;
        const { path } = ctx.request.body as { path?: string };
    
        if (!path || typeof path !== 'string') {
            throw new KnownError({
                message: 'Image path is required',
                code: 400,
                name: 'ValidationError',
            });
        }

        if (!wellId) {
            throw new KnownError({
                message: 'Well ID is required',
                code: 400,
                name: 'ValidationError',
            });
        }
    
        await WellService.deleteWellImage(
            auth,
            wellId, 
            path,
        );
    
        ctx.status = 200;
        ctx.body = { success: true };
    },

    async claimWells(ctx: Context) {
        const auth = ctx.state.auth

        if (auth.user.type === 'guest') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        const token = AbstractTokenSchema.parse(auth.token);

        if (token.type !== 'api-key' && token.type !== 'access') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        const user = UserSchema.parse(auth.user)
        const userId = user.id;
    
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
        const auth = ctx.state.auth

        if (auth.user.type === 'guest') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        const token = AbstractTokenSchema.parse(auth.token);

        if (token.type !== 'api-key' && token.type !== 'access') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        const user = UserSchema.parse(auth.user)
    
        const filters = {
            ...ctx.query,
            userId: user.id,
        };

        const predictions = await WellService.queryWells(filters);
    
        ctx.status = 200;
        ctx.body = { predictions };
    }
}