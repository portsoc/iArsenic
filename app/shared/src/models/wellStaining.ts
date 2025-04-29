import { z } from "zod";

export const StainingSchema = z.enum([
    'red', 
    'black', 
    'not sure',
]);

export type Staining = z.infer<typeof StainingSchema>;
