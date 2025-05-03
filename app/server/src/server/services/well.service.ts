import uuid4 from 'uuid4'
import { Well, WellSchema } from 'iarsenic-types'
import { WellRepo } from '../repositories'
import { KnownError } from '../errors'
import getSignedUploadUrl from '../utils/signedUploadUrl'

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

    async getImageUploadUrl({
        wellId,
        userId,
        contentType,
    }: {
        wellId: string;
        userId: string;
        contentType: string;
    }): Promise<string> {
        const well = await WellRepo.findById(wellId);
    
        if (!well) {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            });
        }
    
        if (well.userId !== userId && well.userId !== 'guest') {
            throw new KnownError({
                message: 'Unauthorized',
                code: 403,
                name: 'UnauthorizedError',
            });
        }
    
        const ext = contentType === 'image/png' ? '.png' :
            contentType === 'image/webp' ? '.webp' :
                '.jpg';
        const destination = `wells/${wellId}/${uuid4()}${ext}`;
    
        const signedUrl = await getSignedUploadUrl(destination, contentType);

        return signedUrl;
    }
}