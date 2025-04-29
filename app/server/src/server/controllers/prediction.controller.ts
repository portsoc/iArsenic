import { Context } from 'koa';
import { AccessTokenSchema, GuestTokenSchema, Prediction, CreatePredictionSchema, validateModel, CreatePrediction } from 'iarsenic-types';
import { PredictionService } from '../services/prediction.service';
import { KnownError } from '../errors';
import { z } from 'zod';

export const PredictionController = {
    async createPrediction(ctx: Context) {
        const token = z.union([
            AccessTokenSchema,
            GuestTokenSchema,
        ]).parse(ctx.state.token);

        const userId = token.userId;

        const result = validateModel(
            ctx.request.body,
            CreatePredictionSchema,
        );

        if (!result.ok) {
            throw new KnownError({
                message: result.error.message,
                code: 400,
                name: 'ValidationError',
            });
        }

        const prediction: Prediction = await PredictionService.createPrediction(
            userId, 
            ctx.request.body as CreatePrediction,
        );

        ctx.status = 201;
        ctx.body = { prediction };
    },

    async createWellPrediction(ctx: Context) {
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
            });
        }

        const prediction = await PredictionService.createWellPrediction(
            userId, 
            wellId,
        );

        ctx.status = 201;
        ctx.body = { prediction };
    },

    async getPredictionById(ctx: Context) {
        const token = z.union([
            AccessTokenSchema,
            GuestTokenSchema,
        ]).parse(ctx.state.token);

        const userId = token.userId;
        const predictionId = ctx.params.id;

        if (!predictionId) {
            throw new KnownError({
                message: 'Prediction ID is required',
                code: 400,
                name: 'ValidationError',
            });
        }

        const prediction = await PredictionService.getPredictionById(
            predictionId, 
            userId,
        );

        ctx.status = 200;
        ctx.body = { prediction };
    },

    async deletePrediction(ctx: Context) {
        ctx.status = 501;
        ctx.body = { error: 'Not Implemented' };
    },

    async getPredictionsByToken(ctx: Context) {
        const token = AccessTokenSchema.parse(ctx.state.token);
        const userId = token.userId;

        const predictions = await PredictionService.getUserPredictions(userId);

        ctx.status = 200;
        ctx.body = { predictions };
    },

    async getAllPredictions(ctx: Context) {
        const predictions = await PredictionService.getAllPredictions();

        ctx.status = 200;
        ctx.body = { predictions };
    },
};
