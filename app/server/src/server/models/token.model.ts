import { z } from 'zod';

export const TokenSchema = z.object({
    id: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    expiresAt: z.date(),
    type: z.literal('access'),
    revokedAt: z.date().optional(),
});

export type Token = z.infer<typeof TokenSchema>;