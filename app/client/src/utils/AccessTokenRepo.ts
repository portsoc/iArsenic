import { navigate } from 'wouter/use-browser-location';
import { AccessTokenSchema, AccessToken, UserSchema } from 'iarsenic-types';

export default class AccessTokenRepo {
    static dataKey: string = 'accessToken';
    static token: AccessToken | null = null;

    static get = async (): Promise<AccessToken | null> => {
        if (AccessTokenRepo.token) return AccessTokenRepo.token;

        const accessToken = localStorage.getItem(this.dataKey) || null;
        if (!accessToken) return null;

        const parsedAccessToken = JSON.parse(accessToken);
        const tokenValidationRes = AccessTokenSchema.safeParse({
            ...parsedAccessToken,
            createdAt: parsedAccessToken.createdAt = new Date(parsedAccessToken.createdAt),
            expiresAt: parsedAccessToken.expiresAt = new Date(parsedAccessToken.expiresAt),
        });

        if (!tokenValidationRes.success) {
            console.error('Failed to validate access token:', tokenValidationRes.error);
            return null;
        }

        const token: AccessToken = tokenValidationRes.data;

        if (token.expiresAt < new Date()) {
            localStorage.removeItem(this.dataKey);
            navigate(`/login`);
            return null;
        }

        const res = await fetch(`/api/v1/self/user`, {
            headers: {
                authorization: `Bearer ${token.id}`,
            }
        });

        if (!res.ok) {
            console.error('Failed to fetch user using access token:', res);
            return null;
        }

        const userData = await res.json();
        const validatedUserRes = UserSchema.safeParse({
            ...userData.user,
            createdAt: new Date(userData.user.createdAt),
        });

        if (!validatedUserRes.success) {
            console.error('Failed to validate user:', validatedUserRes.error);
            return token;
        }

        token.user = validatedUserRes.data;

        return token;
    };

    static delete = () => {
        localStorage.removeItem(AccessTokenRepo.dataKey);
    };

    static set = (accessToken: AccessToken) => {
        localStorage.setItem(
            AccessTokenRepo.dataKey,
            JSON.stringify(accessToken),
        );
    };
}