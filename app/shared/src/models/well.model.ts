import { z } from 'zod';

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

export type ModelMessageCode = z.infer<typeof ModelMessageCodeSchema>;

export const RiskAssesmentSchema = z.union([
    z.literal(0.5),
    z.literal(1.5),
    z.literal(2.5),
    z.literal(3.5),
    z.literal(4.5),
]);

export type RiskAssesment = z.infer<typeof RiskAssesmentSchema>;

export const RegionKeySchema = z.object({
    division: z.string(),
    district: z.string(),
    upazila: z.string(),
    union: z.string(),
    mouza: z.string(),
});

export type RegionKey = z.infer<typeof RegionKeySchema>;

export const StainingSchema = z.enum(['red', 'black', 'not sure']);
export type Staining = z.infer<typeof StainingSchema>;

export const UtensilStainingSchema = z.enum(['red', 'black']);
export type UtensilStaining = z.infer<typeof UtensilStainingSchema>;

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