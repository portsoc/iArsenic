import { z } from 'zod';

export const LanguageSchema = z.enum(['english', 'bengali']);
export type Language = z.infer<typeof LanguageSchema>;

export const UnitsSchema = z.enum(['meters', 'feet']);
export type Units = z.infer<typeof UnitsSchema>;

export const UserSchema = z.object({
    id: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    password: z.string(),
    name: z.string(),
    type: z.enum(['admin', 'user']),
    createdAt: z.date(),
    language: LanguageSchema,
    units: UnitsSchema,
});

export type User = z.infer<typeof UserSchema>;