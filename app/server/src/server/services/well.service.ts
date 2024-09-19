import uuid4 from 'uuid4'
import { Well, WellSchema, Prediction } from 'shared'
import { WellRepo } from '../repositories'
import { KnownError } from '../errors'
import produceEstimate from './well/produceEstimate'

export const WellService = {
    async createWell(userId: string): Promise<Well> {
        const well = {
            id: uuid4(),
            createdAt: new Date(),
            userId: userId,
        }

        return await WellRepo.create(well);
    },

    async getUserWells(userId: string): Promise<Well[]> {
        return await WellRepo.getByQuery([['userId', '==', userId]]);
    },

    async getWellById(wellId: string, userId: string): Promise<Well> {
        const well = await WellRepo.findById(wellId);

        if (!well) {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            })
        }

        const validatedWell = WellSchema.parse(well);

        if (validatedWell.userId !== userId) {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            })
        }

        return validatedWell;
    },

    async updateWell(
        wellId: string,
        userId: string,
        wellUpdates: Partial<Well>,
    ): Promise<Well> {
        const well = await WellRepo.findById(wellId);

        if (!well) {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            })
        }

        if (well.userId !== userId) {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            })
        }

        const updatedWell = {
            ...well,
            ...wellUpdates,
        }

        const validatedWell = WellSchema.parse(updatedWell);

        await WellRepo.update(updatedWell);
        return validatedWell;
    },

    async generateEstimate(userId: string, wellId: string): Promise<Well> {
        const well = await WellRepo.findById(wellId);

        if (!well) {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            })
        }

        if (well.userId !== userId) {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            })
        }

        const modelEstimate = produceEstimate(well);
        const riskAssesment = (() => {
            switch (modelEstimate) {
                case 0: // unable to make an estimate
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
        })();

        const prediction: Prediction = {
            modelOutput: modelEstimate,
            riskAssesment: riskAssesment,
            model: 'model5',
        }

        await WellService.updateWell(wellId, userId, { prediction });

        well.prediction = prediction;
        return well
    }
}