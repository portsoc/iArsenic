import { z } from 'zod';
import { UserSchema } from './user.model';

export const GuestTokenSchema = z.object({
    userId: z.literal('guest'),
    type: z.literal('guest'),
});

export type GuestToken = z.infer<typeof GuestTokenSchema>;

export type Token = z.infer<typeof GuestTokenSchema>;

export const AccessTokenSchema = z.object({
    id: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    expiresAt: z.date(),
    type: z.literal('access'),
    revokedAt: z.date().optional(),
    user: UserSchema.optional(),
})

export type AccessToken = z.infer<typeof AccessTokenSchema>;