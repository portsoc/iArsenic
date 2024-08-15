import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    password: z.string(),
    name: z.string(),
    type: z.enum(['admin', 'user']),
    createdAt: z.date(),
    logins: z.array(z.date()),
});

export type User = z.infer<typeof UserSchema>;