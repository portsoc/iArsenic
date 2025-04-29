import { z } from "zod";
import { StainingSchema } from "./wellStaining";
import { UtensilStainingSchema } from "./utensilStaining";
import { ModelMessageCodeSchema } from "./modelMessageCode";
import { RiskAssesmentSchema } from "./riskAssesment";

export const PredictionSchema = z.object({
    id: z.string(),
    userId: z.string(),
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