import { z } from "zod";
import { StainingSchema, UtensilStainingSchema, ModelMessageCodeSchema, RiskAssesmentSchema } from "./well.model";

export const PredictionSchema = z.object({
    id: z.string(),
    wellId: z.string(),
    createdAt: z.date(),
    division: z.string(),
    district: z.string(),
    upazila: z.string(),
    union: z.string(),
    mouza: z.string(),
    depth: z.number(),
    flooding: z.boolean(),
    staining: StainingSchema,
    utensilStaining: UtensilStainingSchema.nullable(),
    model: z.string(),
    modelOutput: ModelMessageCodeSchema,
    riskAssesment: RiskAssesmentSchema,
});

export type Prediction = z.infer<typeof PredictionSchema>;