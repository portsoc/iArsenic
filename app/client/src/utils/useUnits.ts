import { useAccessToken } from './useAccessToken';
import { useQueryClient } from '@tanstack/react-query';

const UNITS_KEY = 'units';

export function useUnits() {
    const { data: token } = useAccessToken();
    const queryClient = useQueryClient();

    function getUnits(): 'meters' | 'feet' {
        const stored = localStorage.getItem(UNITS_KEY) || 'feet';
        return stored === 'meters' ? 'meters' : 'feet';
    }

    async function setUnits(units: 'meters' | 'feet') {
        localStorage.setItem(UNITS_KEY, units);

        if (token?.user) {
            await fetch(`/api/v1/self/user`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token.id}`,
                },
                body: JSON.stringify({ units }),
            });

            queryClient.invalidateQueries({ queryKey: ['accessToken'] });
        }
    }

    return {
        units: getUnits(),
        setUnits,
    };
}
