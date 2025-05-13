import { StainingSchema } from './wellStaining';
import { UtensilStainingSchema } from './utensilStaining';
import { z } from 'zod';
import { ModelMessageCodeSchema } from './modelMessageCode';
import { RiskAssesmentSchema } from './riskAssesment';

export const WellSchema = z.object({
    complete: z.boolean(),
    createdAt: z.date(),
    depth: z.number().optional(),
    district: z.string().optional(),
    division: z.string().optional(),
    flooding: z.boolean().optional(),
    geolocated: z.boolean(),
    geolocation: z.tuple([z.number(), z.number()]).optional(),
    hasImages: z.boolean(),
    id: z.string(),
    imagePaths: z.array(z.string()).optional(),
    model: z.string().optional(),
    modelOutput: ModelMessageCodeSchema.optional(),
    mouza: z.string().optional(),
    mouzaGeolocation: z.tuple([z.number(), z.number()]).optional(),
    riskAssesment: RiskAssesmentSchema.optional(),
    staining: StainingSchema.optional(),
    union: z.string().optional(),
    upazila: z.string().optional(),
    userId: z.string(),
    utensilStaining: UtensilStainingSchema.optional(),
    wellInUse: z.boolean().optional(),
});

export type Well = z.infer<typeof WellSchema>;
