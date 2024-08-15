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

export const PredictionSchema = z.object({
    id: z.string(),
    wellId: z.string(),
    modelOutput: ModelMessageCodeSchema,
    riskAssesment: RiskAssesmentSchema,
    model: z.string(),
    createdAt: z.date(),
    createdBy: z.string(),
});

export type ModelMessageCode = z.infer<typeof ModelMessageCodeSchema>;
export type RiskAssesmentSchema = z.infer<typeof RiskAssesmentSchema>;
export type Prediction = z.infer<typeof PredictionSchema>;