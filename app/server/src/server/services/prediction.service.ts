import uuid4 from 'uuid4';
import { isEqual } from 'lodash';
import { CompleteWellSchema, CreatePrediction, ModelMessageCode, Prediction } from 'iarsenic-types';
import { PredictionRepo, UserRepo, WellRepo } from '../repositories';
import { KnownError } from '../errors';
import produceEstimate from './prediction/produceEstimate';
import { QueryTuple } from '../types';

function modelEstimateToRiskAssesment(modelEstimate: ModelMessageCode) {
    switch (modelEstimate) {
        case 0: return 2.5;
        case 1: return 0.5;
        case 2: case 3: return 1.5;
        case 4: case 5: return 2.5;
        case 6: return 3.5;
        case 7: case 8: return 4.5;
        default: return 2.5;
    }
}

export const PredictionService = {
    async createPrediction(userId: string, predictors: CreatePrediction): Promise<Prediction> {
        const modelMessageCode = await produceEstimate(predictors)
        const riskAssesment = modelEstimateToRiskAssesment(modelMessageCode)

        const prediction: Prediction = {
            ...predictors,
            id: uuid4(),
            createdAt: new Date(),
            userId,
            model: 'model6',
            modelOutput: modelMessageCode,
            riskAssesment,
            wellId: null,
        };
    
        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        return await PredictionRepo.create(prediction);
    },

    async createWellPrediction(userId: string, wellId: string): Promise<Prediction> {
        const well = await WellRepo.findById(wellId);
        const user = await UserRepo.findById(userId);
    
        if (!user && userId !== 'guest') {
            throw new KnownError({
                message: `User ${userId} not found`,
                code: 404,
                name: 'UserNotFoundError',
            });
        }
    
        if (!well) {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            });
        }
    
        if (userId !== 'guest' && well.userId !== userId && user?.type !== 'admin') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        const completeWellRes = CompleteWellSchema.safeParse(well)

        if (!completeWellRes.success) {
            throw new KnownError({
                message: 'Well data is not complete, unable to produce estimate',
                code: 400,
                name: 'PredictionForIncompleteWellError'
            })
        }

        const completeWell = completeWellRes.data

        const predictors = {
            ...completeWell.regionKey,
            depth: completeWell.depth,
            flooding: completeWell.flooding,
            staining: completeWell.staining,
            utensilStaining: completeWell.utensilStaining
        };

        // --- check if a prediction already exists ---
        const existingPredictions = await PredictionRepo.getByQuery([
            ['wellId', '==', wellId],
        ]);

        const matchingPrediction = existingPredictions.find(existing => 
            isEqual(existing, predictors)
        );
    
        if (matchingPrediction) {
            console.log(`Returning existing prediction ${matchingPrediction.id}`);
            return matchingPrediction;
        }
    
        // --- if no match, create a new prediction ---
        const modelEstimate = await produceEstimate(predictors);
        const riskAssesment = modelEstimateToRiskAssesment(modelEstimate)
    
        const prediction: Prediction = {
            ...predictors,
            id: uuid4(),
            createdAt: new Date(),
            userId,
            wellId,
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

    async queryPredictions(filters: Record<string, any>): Promise<Prediction[]> {
        const queries: QueryTuple[] = [];
    
        for (const [key, value] of Object.entries(filters)) {
            if (Array.isArray(value)) {
                for (const singleValue of value) {
                    queries.push([key, '==', singleValue]);
                }
            } else {
                queries.push([key, '==', value]);
            }
        }
    
        const allPredictions: Prediction[] = [];
    
        for (const query of queries) {
            const results = await PredictionRepo.getByQuery([query]);
            allPredictions.push(...results);
        }
    
        return allPredictions;
    }
};
