import { z } from 'zod';

export const ApiKeySchema = z.object({
    id: z.string(),
    owner: z.string(),
    purpose: z.string(),
    createdAt: z.date(),
    revokedAt: z.date().optional(),
});

export type ApiKey = z.infer<typeof ApiKeySchema>;