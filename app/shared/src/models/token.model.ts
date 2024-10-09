import { z } from 'zod';
import { UserSchema } from './user.model';

export const GuestTokenSchema = z.object({
    userId: z.literal('guest'),
    type: z.literal('guest'),
});

export type GuestToken = z.infer<typeof GuestTokenSchema>;

export const AbstractTokenSchema = z.object({
    id: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    expiresAt: z.date(),
    type: z.union([
        z.literal('access'),
        z.literal('verify-email'),
        z.literal('reset-password'),
    ]),
    revokedAt: z.date().optional(),
})

export type AbstractToken = z.infer<typeof AbstractTokenSchema>;

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

export const VerifyEmailTokenSchema = z.object({
    id: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    expiresAt: z.date(),
    type: z.literal('verify-email'),
    revokedAt: z.date().optional(),
})

export type VerifyEmailToken = z.infer<typeof VerifyEmailTokenSchema>;

export const ResetPasswordTokenSchema = z.object({
    id: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    expiresAt: z.date(),
    type: z.literal('reset-password'),
    revokedAt: z.date().optional(),
});

export type ResetPasswordToken = z.infer<typeof ResetPasswordTokenSchema>;