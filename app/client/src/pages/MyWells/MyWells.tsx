import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import WellCard from './WellCard';
import { useEffect, useState } from 'react';
import { AccessToken, Prediction, Well, WellSchema } from 'iarsenic-types';
import AccessTokenRepo from '../../utils/AccessTokenRepo';
import { navigate } from 'wouter/use-browser-location';
import findWellPredictions from '../../utils/findWellPredictions';
import Filter from './Filter';
import { DropdownDivision } from '../../types';
import fetchDropdownData from '../../utils/fetchDropdownData';

export default function MyWells(): JSX.Element {
    const [token, setToken] = useState<AccessToken>();
    const [wells, setWells] = useState<Well[]>();
    const [dropdownData, setDropdownData] = useState<DropdownDivision[]>();
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchUserWells(token?: AccessToken) {
        if (!token) return;

        const result = await fetch(`/api/v1/self/wells`, {
            headers: {
                authorization: `Bearer ${token.id}`,
            }
        });

        if (!result.ok) {
            console.error('Failed to fetch wells:', result);
            return;
        }

        const data = await result.json();
        const wells = data.wells

        const parsedWells: Well[] = []
        for (const well of wells) {
            parsedWells.push(
                WellSchema.parse({
                    ...well,
                    createdAt: new Date(well.createdAt),
                })
            )
        }

        setWells(parsedWells)
    }

    async function fetchUnclaimedWells() {
        const stored = localStorage.getItem("unclaimedWellIds");
        const ids: string[] = stored ? JSON.parse(stored) : [];

        const responses = await Promise.all(ids.map(id =>
            fetch(`/api/v1/self/well/${id}`)
        ));

        const wells: Well[] = [];

        for (const res of responses) {
            if (res.ok) {
                const well = await res.json();
                const parsedWell = WellSchema.parse({
                    ...well,
                    createdAt: new Date(well.createdAt),
                })
                wells.push(parsedWell);
            }
        }

        setWells(wells);
    }

    async function getWellPredictions() {
        if (wells === undefined) return

        if (!token || wells.length === 0) return;

        const query = wells.map(w => `wellId=${encodeURIComponent(w.id)}`).join('&');

        const res = await fetch(`/api/v1/prediction/query?${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token.id}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch predictions: ${res.status}`);
        }

        const data = await res.json();
        setPredictions(data.predictions);
    }

    async function addWell(): Promise<Well> {
        const token = await AccessTokenRepo.get();

        const headers: HeadersInit = {};
        if (token) {
            headers.authorization = `Bearer ${token.id}`;
        }

        const res = await fetch(`/api/v1/self/well`, {
            method: 'POST',
            headers,
        });

        if (!res.ok) {
            throw new Error('Failed to add well');
        }

        const well = await res.json();

        // Store in localStorage if unauthenticated
        if (!token) {
            const stored = localStorage.getItem("unclaimedWellIds");
            const ids = stored ? JSON.parse(stored) : [];
            localStorage.setItem("unclaimedWellIds", JSON.stringify([...ids, well.id]));
        }

        return well as Well;
    }

    useEffect(() => {
        async function load() {
            const token = await AccessTokenRepo.get();

            if (token) {
                setToken(token);
                await fetchUserWells(token);
            } else {
                await fetchUnclaimedWells();
            }

            setDropdownData(await fetchDropdownData())
            setLoading(false);
        }

        load();
    }, []);

    useEffect(() => {
        getWellPredictions();
    }, [wells]);

    if (wells === undefined || dropdownData === undefined) {
        return (
            <CircularProgress />
        )
    }

    return (
        <>
            <Typography alignSelf="center" variant="h4">
                My Wells
            </Typography>

            {!token && (
                <Alert severity="warning" sx={{ margin: "1rem" }}>
                    You are not logged in. Wells you create will not 
                    be saved to your account until you sign in.
                </Alert>
            )}

            <Button
                onClick={async () => {
                    const newWell = await addWell();
                    navigate(`/well/${newWell.id}/region`);
                }}
                variant="contained"
            >
                Add Well
            </Button>

            <Filter 
                dropdownData={dropdownData} 
            />

            <Box 
                sx={{ 
                    margin: '0 1rem 1rem 1rem', 
                    padding: '1rem',
                    width: '100%',
                }}>
                {loading ? (
                    <Typography>Loading...</Typography>
                ) : wells.length === 0 ? (
                    <Typography>No wells found.</Typography>
                ) : (
                    wells.map(well => (
                        <WellCard
                            key={well.id}
                            well={well}
                            predictions={findWellPredictions(well, predictions)}
                        />
                    ))
                )}
            </Box>
        </>
    );
}
