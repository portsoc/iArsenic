import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { navigate } from 'wouter/use-browser-location';

import WellCard from './WellCard';
// import Filter from './Filter';
import findWellPredictions from '../../utils/findWellPredictions';
import fetchDropdownData from '../../utils/fetchDropdownData';
import { Prediction, Well, WellSchema, PredictionSchema } from 'iarsenic-types';
import { useAccessToken } from '../../utils/useAccessToken';

export default function MyWells(): JSX.Element {
    const [queryParams] = useState<string>('');
    const { data: token } = useAccessToken()

    const dropdownQuery = useQuery({
        queryKey: ['dropdownData'],
        queryFn: fetchDropdownData,
    });

    const wellsQuery = useQuery<Well[]>({
        queryKey: ['wells', token?.id, queryParams],
        enabled: !!token,
        queryFn: async () => {
            const url = queryParams
                ? `/api/v1/self/wells/query?${queryParams}`
                : '/api/v1/self/wells/query';

            const res = await fetch(url, {
                headers: { authorization: `Bearer ${token!.id}` },
            });
            const data = await res.json();
            return data.wells.map((w: any) =>
                WellSchema.parse({ ...w, createdAt: new Date(w.createdAt) })
            );
        },
    });

    const predictionsQuery = useQuery<Prediction[]>({
        queryKey: ['predictions', token?.id, wellsQuery.data?.map(w => w.id).join(',')],
        enabled: !!token && !!wellsQuery.data?.length,
        queryFn: async () => {
            const wells = wellsQuery.data!;
            const batchSize = 25;
            const batches = [];

            for (let i = 0; i < wells.length; i += batchSize) {
                const batch = wells.slice(i, i + batchSize);
                const query = batch.map(w => `wellId=${encodeURIComponent(w.id)}`).join('&');

                batches.push(
                    fetch(`/api/v1/prediction/query?${query}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            authorization: `Bearer ${token!.id}`,
                        },
                    })
                        .then(res => res.json())
                        .then(data =>
                            data.predictions.map((p: any) =>
                                PredictionSchema.parse({
                                    ...p,
                                    createdAt: new Date(p.createdAt),
                                })
                            )
                        )
                );
            }

            const results = await Promise.all(batches);
            return results.flat();
        },
    });

    async function addWell(): Promise<void> {
        const headers: HeadersInit = token ? { authorization: `Bearer ${token.id}` } : {};

        const res = await fetch(`/api/v1/self/well`, { method: 'POST', headers });
        const well = await res.json();

        if (!token) {
            const stored = localStorage.getItem("unclaimedWellIds");
            const ids = stored ? JSON.parse(stored) : [];
            localStorage.setItem("unclaimedWellIds", JSON.stringify([...ids, well.id]));
        }

        navigate(`/well/${well.id}/region`);
    }

    if (wellsQuery.isLoading || dropdownQuery.isLoading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Typography alignSelf="center" variant="h4">
                My Wells
            </Typography>

            {!token && (
                <Alert severity="warning" sx={{ margin: "1rem" }}>
                    You are not logged in. Wells you create will not be saved to your account until you sign in.
                </Alert>
            )}

            <Button onClick={addWell} variant="contained">
                Add Well
            </Button>

            {/* {token && dropdownQuery.data && (
                <Filter dropdownData={dropdownQuery.data} setQueryParams={setQueryParams} />
            )} */}

            <Box sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem', width: '100%' }}>
                {wellsQuery.data?.length === 0 ? (
                    <Typography>No wells found.</Typography>
                ) : (
                    wellsQuery.data?.map(well => (
                        <WellCard
                            key={well.id}
                            well={well}
                            predictions={findWellPredictions(well, predictionsQuery.data || [])}
                        />
                    ))
                )}
            </Box>
        </>
    );
}
