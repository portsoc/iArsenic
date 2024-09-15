import { IAccessToken } from '../../types';
import Config from '../config';

export default class AccessToken {
    static dataKey: string = 'accessToken';

    static get = async (): Promise<IAccessToken | null> => {
        const accessToken = localStorage.getItem(this.dataKey) || null;

        if (!accessToken) return null;

        const parsedAccessToken = JSON.parse(accessToken);

        parsedAccessToken.createdAt = new Date(parsedAccessToken.createdAt);
        parsedAccessToken.expiresAt = new Date(parsedAccessToken.expiresAt);

        if (parsedAccessToken.expiresAt < new Date()) {
            localStorage.removeItem(this.dataKey);
            return null;
        }

        const res = await fetch(`${Config.basePath}/api/v1/self/user`, {
            headers: {
                authorization: `Bearer ${parsedAccessToken.id}`,
            }
        });

        if (!res.ok) {
            console.error('Failed to fetch user using access token:', res);
            return null;
        }

        // TODO add zod
        return parsedAccessToken as IAccessToken;
    };

    static delete = () => {
        localStorage.removeItem(AccessToken.dataKey);
    };

    static set = (accessToken: IAccessToken) => {
        localStorage.setItem(
            AccessToken.dataKey,
            JSON.stringify(accessToken),
        );
    };
}