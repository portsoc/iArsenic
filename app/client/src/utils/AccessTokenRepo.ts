import { navigate } from 'wouter/use-browser-location';
import { AccessTokenSchema, AccessToken } from 'shared';
import Config from '../config';

export default class AccessTokenRepo {
    static dataKey: string = 'accessToken';

    static get = async (): Promise<AccessToken | null> => {
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
            navigate(`${Config.basePath}/login`);
            return null;
        }

        const res = await fetch(`${Config.basePath}/api/v1/self/user`, {
            headers: {
                authorization: `Bearer ${token.id}`,
            }
        });

        if (!res.ok) {
            console.error('Failed to fetch user using access token:', res);
            return null;
        }

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