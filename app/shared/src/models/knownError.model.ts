import { z } from 'zod';

export const KnownErrorArgsSchema = z.object({
    message: z.string(),
    code: z.number(),
    name: z.string(),
});

export type KnownErrorArgs = z.infer<typeof KnownErrorArgsSchema>;

export const KnownErrorSchema = z.object({
    message: z.string(),
    code: z.number(),
    name: z.string(),
});

export type IKnownError = z.infer<typeof KnownErrorSchema>;