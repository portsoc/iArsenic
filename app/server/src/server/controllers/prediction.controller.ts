import { Context } from 'koa';
import { Prediction, CreatePredictionSchema, validateModel, CreatePrediction } from 'iarsenic-types';
import { PredictionService } from '../services/prediction.service';
import { KnownError } from '../errors';

export const PredictionController = {
    async createPrediction(ctx: Context) {
        const auth = ctx.state.auth

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
            auth,
            ctx.request.body as CreatePrediction,
        );

        ctx.status = 201;
        ctx.body = { ...prediction };
    },

    async getPredictionsByQuery(ctx: Context) {
        const filters = ctx.query as Record<string, any>;

        const predictions = await PredictionService.queryPredictions(
            filters, 
        );
    
        ctx.status = 200;
        ctx.body = { predictions };
    },

    async createWellPrediction(ctx: Context) {
        const auth = ctx.state.auth

        const wellId = ctx.params.id;

        if (!wellId) {
            throw new KnownError({
                message: 'Well ID is required',
                code: 400,
                name: 'ValidationError',
            });
        }

        const prediction = await PredictionService.createWellPrediction(
            auth, 
            wellId,
        );

        ctx.status = 201;
        ctx.body = { ...prediction };
    },

    async getPredictionById(ctx: Context) {
        const auth = ctx.state.auth
        const predictionId = ctx.params.id;

        if (!predictionId) {
            throw new KnownError({
                message: 'Prediction ID is required',
                code: 400,
                name: 'ValidationError',
            });
        }

        const prediction = await PredictionService.getPredictionById(
            auth,
            predictionId, 
        );

        ctx.status = 200;
        ctx.body = { ...prediction };
    },

    async deletePrediction(ctx: Context) {
        ctx.status = 501;
        ctx.body = { error: 'Not Implemented' };
    },

    async getUserPredictions(ctx: Context) {
        const auth = ctx.state.auth

        const predictions = await PredictionService.getUserPredictions(
            auth,
        );

        ctx.status = 200;
        ctx.body = { predictions };
    },

    async getAllPredictions(ctx: Context) {
        const auth = ctx.state.auth
        const predictions = await PredictionService.getAllPredictions(auth);

        ctx.status = 200;
        ctx.body = { predictions };
    },
};
