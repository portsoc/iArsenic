import { z } from "zod";

export const RegionKeySchema = z.object({
    division: z.string(),
    district: z.string(),
    upazila: z.string(),
    union: z.string(),
    mouza: z.string(),
});

export type RegionKey = z.infer<typeof RegionKeySchema>;
