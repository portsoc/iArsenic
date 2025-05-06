import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AccessToken, AccessTokenSchema } from 'iarsenic-types';
import { setAccessToken } from './useAccessToken';
import { navigate } from 'wouter/use-browser-location';

interface LoginInput {
    email: string;
    password: string;
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation<AccessToken, Error, LoginInput>({
        mutationFn: async ({ email, password }) => {
            const res = await fetch(`/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('Invalid email or password');
                }

                throw new Error(`Failed to login: ${res.status}`);
            }

            const data = await res.json();
            const token = data.accessToken;

            const validated = AccessTokenSchema.safeParse({
                ...token,
                createdAt: new Date(token.createdAt),
                expiresAt: new Date(token.expiresAt),
                revokedAt: token.revokedAt ? new Date(token.revokedAt) : undefined,
            });

            if (!validated.success) {
                throw new Error('Invalid access token');
            }

            return validated.data;
        },
        onSuccess: (token) => {
            setAccessToken(token);
            queryClient.invalidateQueries({ queryKey: ['accessToken'] });
            navigate(`/my-wells`);
        },
    });
}
