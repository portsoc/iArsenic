import uuid4 from 'uuid4';
import { Prediction } from 'iarsenic-types';
import { PredictionRepo, UserRepo, WellRepo } from '../repositories';
import { KnownError } from '../errors';
import produceEstimate from './prediction/produceEstimate';

export const PredictionService = {
    async createPrediction(userId: string, predictors: Partial<Prediction>): Promise<Prediction> {
        const prediction: Prediction = {
            id: uuid4(),
            createdAt: new Date(),
            userId,
            wellId: predictors.wellId ?? null,
            division: predictors.division!,
            district: predictors.district!,
            upazila: predictors.upazila!,
            union: predictors.union!,
            mouza: predictors.mouza!,
            depth: predictors.depth!,
            flooding: predictors.flooding!,
            staining: predictors.staining!,
            utensilStaining: predictors.utensilStaining ?? null,
            model: predictors.model!,
            modelOutput: predictors.modelOutput!,
            riskAssesment: predictors.riskAssesment!,
        };

        return await PredictionRepo.create(prediction);
    },

    async createWellPrediction(userId: string, wellId: string): Promise<Prediction> {
        const well = await WellRepo.findById(wellId);

        const user = await UserRepo.findById(userId)

        if (!user) {
            throw new KnownError({
                message: `User ${userId} not found`,
                code: 404,
                name: 'UserNotFoundError'
            })
        }

        if (!well) {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            });
        }

        if (well.userId !== userId && user.type !== 'admin') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        const modelEstimate = await produceEstimate(well);
        const riskAssesment = (() => {
            switch (modelEstimate) {
                case 0: return 2.5;
                case 1: return 0.5;
                case 2: case 3: return 1.5;
                case 4: case 5: return 2.5;
                case 6: return 3.5;
                case 7: case 8: return 4.5;
                default: return 2.5;
            }
        })();

        const prediction: Prediction = {
            id: uuid4(),
            createdAt: new Date(),
            userId,
            wellId,
            division: well.regionKey?.division!,
            district: well.regionKey?.district!,
            upazila: well.regionKey?.upazila!,
            union: well.regionKey?.union!,
            mouza: well.regionKey?.mouza!,
            depth: well.depth!,
            flooding: well.flooding!,
            staining: well.staining!,
            utensilStaining: well.utensilStaining ?? null,
            model: 'model6',
            modelOutput: modelEstimate,
            riskAssesment,
        };

        return await PredictionRepo.create(prediction);
    },

    async getPredictionById(predictionId: string, userId: string): Promise<Prediction> {
        const prediction = await PredictionRepo.findById(predictionId);

        if (!prediction) {
            throw new KnownError({
                message: 'Prediction not found',
                code: 404,
                name: 'PredictionNotFoundError',
            });
        }

        if (prediction.userId !== userId) {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        return prediction;
    },

    async getUserPredictions(userId: string): Promise<Prediction[]> {
        return await PredictionRepo.getByQuery([
            ['userId', '==', userId],
        ]);
    },

    async getAllPredictions(): Promise<Prediction[]> {
        return await PredictionRepo.findAll();
    },
};
