import { IAccessToken } from '../../types'
export default class AccessToken {
    static dataKey: string = 'accessToken';

    static get = (): IAccessToken | null => {
        const accessToken = localStorage.getItem(this.dataKey) || null;

        if (!accessToken) return null

        const parsedAccessToken = JSON.parse(accessToken);

        parsedAccessToken.createdAt = new Date(parsedAccessToken.createdAt);
        parsedAccessToken.expiresAt = new Date(parsedAccessToken.expiresAt);

        if (parsedAccessToken.expiresAt < new Date()) {
            localStorage.removeItem(this.dataKey);
            return null;
        }

        return JSON.parse(accessToken);
    };

    static set = (accessToken: IAccessToken) => {
        localStorage.setItem(
            AccessToken.dataKey,
            JSON.stringify(accessToken),
        );
    };
}