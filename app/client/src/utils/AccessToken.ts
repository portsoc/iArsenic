import { navigate } from 'wouter/use-browser-location';
import { Token, TokenSchema } from 'shared';
import Config from '../config';

export default class AccessToken {
    static dataKey: string = 'accessToken';

    static get = async (): Promise<Token | null> => {
        const accessToken = localStorage.getItem(this.dataKey) || null;

        if (!accessToken) return null;

        const parsedAccessToken = JSON.parse(accessToken);
        const tokenValidationRes = TokenSchema.safeParse({
            ...parsedAccessToken,
            createdAt: parsedAccessToken.createdAt = new Date(parsedAccessToken.createdAt),
            expiresAt: parsedAccessToken.expiresAt = new Date(parsedAccessToken.expiresAt),
        });

        if (!tokenValidationRes.success) {
            console.error('Failed to validate access token:', tokenValidationRes.error);
            return null;
        }

        const token: Token = tokenValidationRes.data;

        if (token.type !== 'access') {
            console.error('Invalid token type:', token.type);
            return null;
        }

        token.createdAt = new Date(token.createdAt);
        token.expiresAt = new Date(token.expiresAt);

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
        localStorage.removeItem(AccessToken.dataKey);
    };

    static set = (accessToken: Token) => {
        localStorage.setItem(
            AccessToken.dataKey,
            JSON.stringify(accessToken),
        );
    };
}