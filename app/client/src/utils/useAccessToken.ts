import { useQuery } from '@tanstack/react-query';
import { AccessTokenSchema, AccessToken, UserSchema } from 'iarsenic-types';
import { navigate } from 'wouter/use-browser-location';

const ACCESS_TOKEN_KEY = 'accessToken';

export function setAccessToken(token: AccessToken): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(token));
}

export function deleteAccessToken(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

async function fetchAccessToken(): Promise<AccessToken | null> {
    const raw = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const result = AccessTokenSchema.safeParse({
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        expiresAt: new Date(parsed.expiresAt),
    });

    if (!result.success) {
        console.error('Invalid access token:', result.error);
        return null;
    }

    const token = result.data;

    if (token.expiresAt < new Date()) {
        deleteAccessToken();
        navigate('/login');
        return null;
    }

    const res = await fetch('/api/v1/self/user', {
        headers: { authorization: `Bearer ${token.id}` },
    });

    if (!res.ok) {
        console.error('Failed to fetch user:', res);
        return null;
    }

    const userData = await res.json();
    const validated = UserSchema.safeParse({
        ...userData,
        createdAt: new Date(userData.createdAt),
    });

    if (validated.success) {
        token.user = validated.data;
    } else {
        console.error('User validation failed:', validated.error);
    }

    return token;
}

export function useAccessToken() {
    return useQuery({
        queryKey: ['accessToken'],
        queryFn: fetchAccessToken,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
