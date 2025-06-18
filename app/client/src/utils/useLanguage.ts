// src/utils/useLanguage.ts
import { useAccessToken } from './useAccessToken';

const LANGUAGE_KEY = 'language';

export function useLanguage() {
    const { data: token } = useAccessToken();

    function getLanguage(): 'english' | 'bengali' {
        const stored = localStorage.getItem(LANGUAGE_KEY) || 'bengali';
        return stored === 'english' ? 'english' : 'bengali';
    }

    function init() {
        document.body.className = getLanguage();
    }

    async function setLanguage(language: 'english' | 'bengali') {
        localStorage.setItem(LANGUAGE_KEY, language);
        document.body.className = language;

        if (token?.user) {
            const res = await fetch(`/api/v1/self/user`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token.id}`,
                },
                body: JSON.stringify({ language }),
            });

            if (!res.ok) {
                console.error('Failed to update user language:', res);
            } 
        }
    }

    return {
        language: getLanguage(),
        setLanguage,
        init,
    };
}
