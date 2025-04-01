import AccessTokenRepo from "./AccessTokenRepo";

export default class LanguageSelector {
    static dataKey: string = 'language';

    static init = async () => {
        const language = await LanguageSelector.get();
        document.body.className = language;
    };

    static get = async (): Promise<'english' | 'bengali'> => {
        const token = await AccessTokenRepo.get();

        if (token == null || token?.user == null) {
            const language = localStorage.getItem(this.dataKey) || 'english';

            if (language !== 'english' && language !== 'bengali') {
                throw new Error(`Invalid language in local storage ${language}`);
            }

            return language;
        }

        return token.user.language;
    };

    static set = async (language: 'english' | 'bengali') => {
        localStorage.setItem(LanguageSelector.dataKey, language);

        const token = await AccessTokenRepo.get();

        if (token != null && token?.user != null) {
            const res = await fetch(`/api/v1/self/user`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token.id}`,
                },
                body: JSON.stringify({ language: language }),
            });

            if (!res.ok) {
                console.error('Failed to update user language:', res);
            }
        }

        document.body.className = language;
    };
}