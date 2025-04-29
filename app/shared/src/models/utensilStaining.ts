import { z } from "zod";

export const UtensilStainingSchema = z.enum([
    'red', 
    'black',
]);

export type UtensilStaining = z.infer<typeof UtensilStainingSchema>;
