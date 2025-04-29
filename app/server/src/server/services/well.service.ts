import uuid4 from 'uuid4'
import { Well, WellSchema } from 'iarsenic-types'
import { WellRepo } from '../repositories'
import { KnownError } from '../errors'

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

    async getAllWells(): Promise<Well[]> {
        return await WellRepo.findAll();
    },
}