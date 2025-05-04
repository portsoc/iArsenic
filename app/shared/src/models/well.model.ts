import { StainingSchema } from './wellStaining';
import { UtensilStainingSchema } from './utensilStaining';
import { z } from 'zod';

export const WellSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    userId: z.string(),
    wellInUse: z.boolean().optional(),
    division: z.string().optional(),
    district: z.string().optional(),
    upazila: z.string().optional(),
    union: z.string().optional(),
    mouza: z.string().optional(),
    depth: z.number().optional(),
    flooding: z.boolean().optional(),
    staining: StainingSchema.optional(),
    utensilStaining: UtensilStainingSchema.optional(),
    geolocation: z.tuple([z.number(), z.number()]).optional(),
    imagePaths: z.array(z.string()).optional(),
});


export type Well = z.infer<typeof WellSchema>;

export const CompleteWellSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    userId: z.string(),
    wellInUse: z.boolean(),
    division: z.string(),
    district: z.string(),
    upazila: z.string(),
    union: z.string(),
    mouza: z.string(),
    depth: z.number(),
    flooding: z.boolean(),
    staining: StainingSchema,
    utensilStaining: UtensilStainingSchema.optional(),
    geolocation: z.tuple([z.number(), z.number()]).optional(),
    imagePaths: z.array(z.string()).optional(),
});

export type CompleteWell = z.infer<typeof CompleteWellSchema>;
