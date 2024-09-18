import { z } from 'zod';

export const TokenSchema = z.union([
    z.object({
        id: z.string(),
        userId: z.string(),
        createdAt: z.date(),
        expiresAt: z.date(),
        type: z.literal('access'),
        revokedAt: z.date().optional(),
    }),
    z.object({
        userId: z.literal('guest'),
        type: z.literal('guest'),
    }),
]);


export type Token = z.infer<typeof TokenSchema>;