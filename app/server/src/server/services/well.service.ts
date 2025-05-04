import uuid4 from 'uuid4'
import { Well, WellSchema } from 'iarsenic-types'
import { WellRepo } from '../repositories'
import { KnownError } from '../errors'
import getSignedUrl from '../utils/signedUrl'
import { deleteFileFromBucket } from '../utils/deleteFileFromBucket'
import { QueryTuple } from '../types'

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
    }): Promise<{ signedUrl: string, path: string }> {
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
    
        const signedUrl = await getSignedUrl(
            'write',
            destination, 
            contentType,
        );

        return { 
            signedUrl,
            path: destination,
        }
    },
    
    async confirmImageUpload({
        wellId,
        userId,
        imagePath,
    }: {
        wellId: string;
        userId: string;
        imagePath: string;
    }): Promise<Well> {
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
    
        const updatedWell: Well = {
            ...well,
            imagePaths: Array.isArray(well.imagePaths)
                ? [...well.imagePaths, imagePath]
                : [imagePath],
        };
    
        const validatedWell = WellSchema.parse(updatedWell);
        await WellRepo.update(validatedWell);
    
        return validatedWell;
    },

    async getWellImageSignedUrls(wellId: string, userId: string) {
        const well = await WellRepo.findById(wellId);
    
        if (!well) {
            throw new KnownError({ message: 'Well not found', code: 404, name: 'WellNotFoundError' });
        }
    
        if (well.userId !== userId && well.userId !== 'guest') {
            throw new KnownError({ message: 'Unauthorized', code: 403, name: 'UnauthorizedError' });
        }
    
        const imagePaths = Array.isArray(well.imagePaths) ? well.imagePaths : [];
    
        const signedUrls = await Promise.all(imagePaths.map(path =>
            getSignedUrl(
                'read',
                path,
            ) 
        ));
    
        return signedUrls;
    },

    async deleteWellImage(wellId: string, userId: string, imagePath: string) {
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
    
        const imagePaths = Array.isArray(well.imagePaths) ? well.imagePaths : [];
    
        if (!imagePaths.includes(imagePath)) {
            throw new KnownError({
                message: 'Image not associated with this well',
                code: 400,
                name: 'ImageNotLinkedError',
            });
        }
    
        await deleteFileFromBucket(imagePath);

        const updatedPaths = imagePaths.filter(p => p !== imagePath);
        const updatedWell = {
            ...well,
            imagePaths: updatedPaths,
        }

        await WellRepo.update(updatedWell);
    
        return { message: `Image deleted: ${imagePath}` };
    },
    
    async claimGuestWells(userId: string, guestWellIds: string[]) {
        const updatedWells: Well[] = [];
    
        for (const id of guestWellIds) {
            const well = await WellRepo.findById(id);
    
            if (!well || well.userId !== 'guest') continue;
    
            const updated = { ...well, userId };
            await WellRepo.update(updated);
            updatedWells.push(updated);
        }
    
        return updatedWells;
    },

    async queryWells(filters: Record<string, any>): Promise<Well[]> {
        const queries: QueryTuple[] = [];
    
        for (const [key, value] of Object.entries(filters)) {
            if (Array.isArray(value)) {
                throw new Error(`Multiple filters for '${key}' are not supported.`);
            }
    
            if (key.endsWith('_gte')) {
                queries.push([key.replace('_gte', ''), '>=', Number(value)]);
            } else if (key.endsWith('_lte')) {
                queries.push([key.replace('_lte', ''), '<=', Number(value)]);
            } else if (key.endsWith('_exists')) {
                if (value === 'true') {
                    queries.push([key.replace('_exists', ''), '!=', null]);
                }
            } else {
                // Convert "true"/"false" to booleans
                const parsedValue = value === 'true'
                    ? true
                    : value === 'false'
                    ? false
                    : value;
                queries.push([key, '==', parsedValue]);
            }
        }

        console.log(queries)
    
        return await WellRepo.getByQuery(queries);
    }
}