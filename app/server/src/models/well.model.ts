import { z } from 'zod';

export const RegionKeySchema = z.object({
    division: z.string(),
    district: z.string(),
    upazila: z.string(),
    union: z.string(),
    mouza: z.string(),
});

export const WellSchema = z.object({
    id: z.string(),
    regionKey: RegionKeySchema,
    depth: z.number(), // in meters
    flooding: z.boolean(),
    staining: z.enum(['red', 'black', 'not sure']),
    utensilStaining: z.enum(['red', 'black', 'blackish', 'N/A']),
    geoLocation: z.union([z.tuple([z.number(), z.number()]), z.literal('N/A')]),
    createdAt: z.date(),
    createdBy: z.string(),
});

export type RegionKey = z.infer<typeof RegionKeySchema>;
export type Well = z.infer<typeof WellSchema>;