import { Context } from 'koa';
import { z } from 'zod';
import { GeodataService } from '../services/geodata.service';
import { KnownError } from '../errors';

export const GeodataController = {
    async findRegion(ctx: Context) {
        const querySchema = z.object({
            lat: z.string().transform(parseFloat).refine(v => !isNaN(v), { message: 'Invalid latitude' }),
            lon: z.string().transform(parseFloat).refine(v => !isNaN(v), { message: 'Invalid longitude' }),
        });

        const { lat, lon } = querySchema.parse(ctx.query);

        const region = await GeodataService.findRegionByLatLon(lat, lon);

        if (!region) {
            throw new KnownError({
                code: 404,
                name: 'RegionNotFound',
                message: `Point lat=${lat}, lon=${lon} not within known region`,
            });
        }

        ctx.status = 200;
        ctx.body = { ...region };
    },
};
