import uuid4 from 'uuid4';
import { isEqual } from 'lodash';
import { AbstractToken, CreatePrediction, CreatePredictionSchema, ModelMessageCode, Prediction, User } from 'iarsenic-types';
import { PredictionRepo, WellRepo } from '../repositories';
import { KnownError } from '../errors';
import produceEstimate from './prediction/produceEstimate';
import { QueryTuple } from '../types';

function modelEstimateToRiskAssesment(modelEstimate: ModelMessageCode) {
    switch (modelEstimate) {
        case 0: 
            return 2.5;
        case 1: 
            return 0.5;
        case 2: 
        case 3: 
            return 1.5;
        case 4: 
        case 5: 
            return 2.5;
        case 6: 
            return 3.5;
        case 7: 
        case 8: 
            return 4.5;
        default: 
            return 2.5;
    }
}

export const PredictionService = {
    async createPrediction(
        auth: { user: User, token: AbstractToken },
        predictors: CreatePrediction
    ): Promise<Prediction> {
        if (auth.user.type !== 'admin') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        const modelMessageCode = await produceEstimate(predictors)
        const riskAssesment = modelEstimateToRiskAssesment(modelMessageCode)

        const prediction: Prediction = {
            ...predictors,
            id: uuid4(),
            createdAt: new Date(),
            userId: auth.user.id,
            model: 'model6',
            modelOutput: modelMessageCode,
            riskAssesment,
            wellId: null,
        };
    
        return await PredictionRepo.create(prediction);
    },

    async createWellPrediction(
        auth: { user: User | { type: 'guest' }, token: AbstractToken },
        wellId: string
    ): Promise<Prediction> {
        const well = await WellRepo.findById(wellId);

        if (!well) {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            });
        }

        if (well.userId !== 'guest') {
            if (auth.user.type !== 'guest' && well.userId !== auth.user.id) {
                if (auth.user.type !== 'admin') {
                    throw new KnownError({
                        message: 'Unauthorized',
                        code: 403,
                        name: 'UnauthorizedError',
                    });
                }
            }
        }
    
        const completeWellRes = CreatePredictionSchema.safeParse({
            ...well,
            utensilStaining: well.utensilStaining ?
                well.utensilStaining :
                null
        })

        if (!completeWellRes.success) {
            console.error(completeWellRes.error)
            throw new KnownError({
                message: 'Well data is not complete, unable to produce estimate',
                code: 400,
                name: 'PredictionForIncompleteWellError'
            })
        }

        const completeWell = completeWellRes.data

        const predictors = {
            division: completeWell.division,
            district: completeWell.district,
            upazila: completeWell.upazila,
            union: completeWell.union,
            mouza: completeWell.mouza,
            depth: completeWell.depth,
            flooding: completeWell.flooding,
            staining: completeWell.staining,
            utensilStaining: completeWell.utensilStaining || null,
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
        
        const userId = auth.user.type === 'guest' ?
            'guest' :
            auth.user.id
    
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

    async getPredictionById(
        auth: { user: User, token: AbstractToken },
        predictionId: string, 
    ): Promise<Prediction> {
        const prediction = await PredictionRepo.findById(predictionId);

        if (!prediction) {
            throw new KnownError({
                message: 'Prediction not found',
                code: 404,
                name: 'PredictionNotFoundError',
            });
        }

        // anyone with the well ID can delete guest well images
        if (prediction.userId !== 'guest') {
            // users can delete their own well
            if (prediction.userId !== auth.user.id) {
                // only admins can delete images of wells that aren't theirs
                if (auth.user.type !== 'admin') {
                    throw new KnownError({
                        message: 'Unauthorized',
                        code: 403,
                        name: 'UnauthorizedError',
                    });
                }
            }
        }

        return prediction;
    },

    async getUserPredictions(
        auth: { user: User, token: AbstractToken },
    ): Promise<Prediction[]> {
        if (auth.user.type !== 'user' && auth.user.type !== 'admin') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        return await PredictionRepo.getByQuery([
            ['userId', '==', auth.user.id],
        ]);
    },

    async getAllPredictions(auth: { user: User, token: AbstractToken }): Promise<Prediction[]> {
        if (auth.user.type !== 'admin') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }

        return await PredictionRepo.findAll();
    },

    async queryPredictions(
        filters: Record<string, any>
    ): Promise<Prediction[]> {
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
