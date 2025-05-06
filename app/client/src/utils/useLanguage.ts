// src/utils/useLanguage.ts
import { useAccessToken } from './useAccessToken';
import { useQueryClient } from '@tanstack/react-query';

const LANGUAGE_KEY = 'language';

export function useLanguage() {
    const { data: token } = useAccessToken();

    function getLanguage(): 'english' | 'bengali' {
        const stored = localStorage.getItem(LANGUAGE_KEY) || 'english';
        return stored === 'bengali' ? 'bengali' : 'english';
    }

    function init() {
        document.body.className = getLanguage();
    }

    async function setLanguage(language: 'english' | 'bengali') {
        const queryClient = useQueryClient();
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
            } else {
                queryClient.invalidateQueries({ queryKey: ['accessToken'] });
            }
        }
    }

    return {
        language: getLanguage(),
        setLanguage,
        init,
    };
}
