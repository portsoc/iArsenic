import uuid4 from 'uuid4'
import { AbstractToken, ModelMessageCode, User, Well, WellSchema } from 'iarsenic-types'
import { WellRepo } from '../repositories'
import { KnownError } from '../errors'
import getSignedUrl from '../utils/signedUrl'
import { deleteFileFromBucket } from '../utils/deleteFileFromBucket'
import { QueryTuple } from '../types'
import produceEstimate from './prediction/produceEstimate'
import { GeodataService } from './geodata.service'

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

export const WellService = {
    async createWell(
        auth: { user: User | { type: 'guest' }, token: AbstractToken },
        data: Partial<Well> = {}
    ): Promise<Well> {
        const userId = auth.user.type === 'guest' ? 'guest' : auth.user.id;
    
        const well = {
            id: uuid4(),
            createdAt: new Date(),
            userId,
            ...data,
        };
    
        well.geolocated = Array.isArray(well.geolocation)
            && well.geolocation.length === 2
            && typeof well.geolocation[0] === 'number'
            && typeof well.geolocation[1] === 'number';
    
        well.hasImages = Array.isArray(well.imagePaths)
            && well.imagePaths.length > 0;
    
        well.complete = (
            well.wellInUse !== undefined &&
            !!well.division &&
            !!well.district &&
            !!well.upazila &&
            !!well.union &&
            !!well.mouza &&
            typeof well.depth === 'number' &&
            typeof well.flooding === 'boolean' &&
            !!well.staining
        );
    
        const validatedWell = WellSchema.parse(well);
        return await WellRepo.create(validatedWell);
    },

    async getUserWells(userId: string): Promise<Well[]> {
        return await WellRepo.getByQuery([['userId', '==', userId]]);
    },

    async getWellById(
        _auth: { user: User, token: AbstractToken },
        wellId: string
    ): Promise<Well> {
        const well = await WellRepo.findById(wellId);

        if (!well) {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            })
        }

        // disable auth for demonstration while accounts system is not up and running
        // this is so that the maps function without errors
        // if the accounts system and error handling is setup properly
        // this will be re-enabled though it will require the maps to be
        // kept behind admin auth as it shows data about every well in the system
        // if (well.userId !== 'guest') {
        //     if (well.userId !== auth.user.id) {
        //         if (auth.user.type !== 'admin') {
        //             throw new KnownError({
        //                 message: 'Unauthorized',
        //                 code: 403,
        //                 name: 'UnauthorizedError',
        //             });
        //         }
        //     }
        // }

        return WellSchema.parse(well);
    },

    async updateWell(
        auth: { user: User | { type: 'guest' }, token: AbstractToken },
        wellId: string,
        wellUpdates: Partial<Well>,
    ): Promise<Well> {
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
    
        let mouzaGeolocation = undefined;
        if (wellUpdates.mouza != null) {
            const division = wellUpdates.division || well.division;
            const district = wellUpdates.district || well.district;
            const upazila = wellUpdates.upazila || well.upazila;
            const union = wellUpdates.union || well.union;
            const mouza = wellUpdates.mouza || well.mouza;
    
            if (district && division && upazila && union && mouza) {
                mouzaGeolocation = await GeodataService.getLatLonFromRegion({
                    division,
                    district,
                    upazila,
                    union,
                    mouza,
                }, true);
            }
        }
    
        let modelOutput;
        try {
            modelOutput = await produceEstimate(well);
        } catch {}
    
        if (modelOutput || modelOutput === 0) {
            wellUpdates.modelOutput = modelOutput;
            wellUpdates.riskAssesment = modelEstimateToRiskAssesment(modelOutput);
            wellUpdates.model = 'model6';
        }
    
        const updatedWell = {
            ...well,
            ...wellUpdates,
            mouzaGeolocation: well.mouzaGeolocation || mouzaGeolocation,
        };
    
        updatedWell.geolocated = Array.isArray(updatedWell.geolocation)
            && updatedWell.geolocation.length === 2
            && typeof updatedWell.geolocation[0] === 'number'
            && typeof updatedWell.geolocation[1] === 'number';
    
        updatedWell.hasImages = Array.isArray(updatedWell.imagePaths)
            && updatedWell.imagePaths.length > 0;
    
        updatedWell.complete = (
            updatedWell.wellInUse !== undefined &&
            !!updatedWell.division &&
            !!updatedWell.district &&
            !!updatedWell.upazila &&
            !!updatedWell.union &&
            !!updatedWell.mouza &&
            typeof updatedWell.depth === 'number' &&
            typeof updatedWell.flooding === 'boolean' &&
            !!updatedWell.staining
        );
    
        const validatedWell = WellSchema.parse(updatedWell);
    
        await WellRepo.update(validatedWell);
        return validatedWell;
    },

    async getAllWells(): Promise<Well[]> {
        return await WellRepo.findAll();
    },

    async getImageUploadUrl(
        auth: { user: User | { type: 'guest' }, token: AbstractToken },
        wellId: string,
        contentType: string,
    ): Promise<{ signedUrl: string, path: string }> {
        const well = await WellRepo.findById(wellId);
    
        if (!well) {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            });
        }

        // anyone with the well ID can upload guest well images
        if (well.userId !== 'guest') {
            // users can upload images to their own well
            if (auth.user.type !== 'guest' && well.userId !== auth.user.id) {
                // only admins can upload images of wells that aren't theirs
                if (auth.user.type !== 'admin') {
                    throw new KnownError({
                        message: 'Unauthorized',
                        code: 403,
                        name: 'UnauthorizedError',
                    });
                }
            }
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
    
    async confirmImageUpload(
        auth: { user: User | { type: 'guest' }, token: AbstractToken },
        wellId: string,
        imagePath: string,
    ): Promise<Well> {
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

    async getWellImageSignedUrls(
        auth: { user: User | { type: 'guest' }, token: AbstractToken },
        wellId: string, 
    ) {
        const well = await WellRepo.findById(wellId);
    
        if (!well) {
            throw new KnownError({ message: 'Well not found', code: 404, name: 'WellNotFoundError' });
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
    
        const imagePaths = Array.isArray(well.imagePaths) ? well.imagePaths : [];
    
        const signedUrls = await Promise.all(imagePaths.map(path =>
            getSignedUrl(
                'read',
                path,
            ) 
        ));
    
        return signedUrls;
    },

    async deleteWellImage(
        auth: { user: User | { type: 'guest' }, token: AbstractToken },
        wellId: string, 
        imagePath: string,
    ) {
        const well = await WellRepo.findById(wellId);
    
        if (!well) {
            throw new KnownError({
                message: 'Well not found',
                code: 404,
                name: 'WellNotFoundError',
            });
        }

        // anyone with the well ID can delete guest well images
        if (well.userId !== 'guest') {
            // users can delete their own well
            if (auth.user.type !== 'guest' && well.userId !== auth.user.id) {
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
                    queries.push([key.replace('_exists', ''), '==', true]);
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

        return await WellRepo.getByQuery(queries);
    },

    async generatePrediction(
        auth: { user: User | { type: 'guest' }, token: AbstractToken },
        wellId: string, 
    ): Promise<Well> {
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

        const modelEstimate = await produceEstimate(well)
        const riskAssesment = modelEstimateToRiskAssesment(modelEstimate)
        const predictedWell: Well = {
            ...well,
            modelOutput: modelEstimate,
            riskAssesment,
            model: 'model6',
        }

        await WellRepo.update(predictedWell)

        return predictedWell
    }
}
