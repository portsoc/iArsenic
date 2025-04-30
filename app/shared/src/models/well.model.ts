import { RegionKeySchema } from './regionKey';
import { StainingSchema } from './wellStaining';
import { UtensilStainingSchema } from './utensilStaining';
import { z } from 'zod';

export const WellSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    userId: z.string(),
    drinkingWaterSource: z.boolean().optional(),
    regionKey: RegionKeySchema.optional(),
    depth: z.number().optional(),
    flooding: z.boolean().optional(),
    staining: StainingSchema.optional(),
    utensilStaining: UtensilStainingSchema.optional(),
    geolocation: z.tuple([z.number(), z.number()]).optional(),
});

export type Well = z.infer<typeof WellSchema>;

export const CompleteWellSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    userId: z.string(),
    // drinkingWaterSource: z.boolean(),
    regionKey: RegionKeySchema,
    depth: z.number(),
    flooding: z.boolean(),
    staining: StainingSchema,
    utensilStaining: UtensilStainingSchema.optional(),
    geolocation: z.tuple([z.number(), z.number()]).optional(),
});

export type CompleteWell = z.infer<typeof CompleteWellSchema>;
