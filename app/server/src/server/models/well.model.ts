import { z } from 'zod';

// raw output code from model
export const ModelMessageCodeSchema = z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7),
    z.literal(8),
]);

// value shown on speedometer
export const RiskAssesmentSchema = z.union([
    z.literal(0.5),
    z.literal(1.5),
    z.literal(2.5),
    z.literal(3.5),
    z.literal(4.5),
]);

export const RegionKeySchema = z.object({
    division: z.string(),
    district: z.string(),
    upazila: z.string(),
    union: z.string(),
    mouza: z.string(),
});

export const WellSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    userId: z.string(),
    regionKey: RegionKeySchema.optional(),
    depth: z.number().optional(), // in meters
    flooding: z.boolean().optional(),
    staining: z.enum(['red', 'black', 'not sure']).optional(),
    utensilStaining: z.enum(['red', 'black', 'blackish', 'N/A']).optional(),
    geolocation: z.union([z.tuple([z.number(), z.number()]), z.literal('N/A')]).optional(),
    prediction: z.object({
        modelOutput: ModelMessageCodeSchema,
        riskAssesment: RiskAssesmentSchema,
        model: z.string(),
    }).optional(),
});

export type RegionKey = z.infer<typeof RegionKeySchema>;
export type Well = z.infer<typeof WellSchema>;
export type ModelMessageCode = z.infer<typeof ModelMessageCodeSchema>;
export type RiskAssesmentSchema = z.infer<typeof RiskAssesmentSchema>;