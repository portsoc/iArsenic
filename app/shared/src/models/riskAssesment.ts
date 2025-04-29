import { z } from "zod";

export const RiskAssesmentSchema = z.union([
    z.literal(0.5),
    z.literal(1.5),
    z.literal(2.5),
    z.literal(3.5),
    z.literal(4.5),
]);

export type RiskAssesment = z.infer<typeof RiskAssesmentSchema>;