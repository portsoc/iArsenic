import AccessTokenRepo from "./AccessTokenRepo";

export default class UnitsSelector {
    static dataKey: string = 'units';

    static get = async (): Promise<'feet' | 'meters'> => {
        const token = await AccessTokenRepo.get();

        if (token == null || token?.user == null) {
            const units = localStorage.getItem(this.dataKey) || 'meters';

            if (units !== 'meters' && units !== 'feet') {
                throw new Error(`Invalid units in local storage ${units}`);
            }

            return units;
        }

        return token.user.units;
    };

    static set = async (units: 'meters' | 'feet') => {
        localStorage.setItem(UnitsSelector.dataKey, units);

        const token = await AccessTokenRepo.get();

        if (token != null && token?.user != null) {
            const res = await fetch(`/api/v1/self/user`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token.id}`,
                },
                body: JSON.stringify({ units: units }),
            });

            if (!res.ok) {
                console.error('Failed to update user units:', res);
            }
        }
    };
}