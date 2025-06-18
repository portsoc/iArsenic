import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { navigate } from 'wouter/use-browser-location';

import WellCard from './WellCard';
import fetchDropdownData from '../../utils/fetchDropdownData';
import { Well, WellSchema } from 'iarsenic-types';
import { useAccessToken } from '../../utils/useAccessToken';
import Filter from './Filter';
import TranslatableText from '../../components/TranslatableText';

export default function MyWells(): JSX.Element {
    const [filterOpen, setFilterOpen] = useState<boolean>(false)
    const [queryParams, setQueryParams] = useState<Record<string, string>>({});
    const [filters, setFilters] = useState({
        wellInUse: false,
        flooding: '',
        staining: '',
        geolocated: false,
        hasImages: false,
        complete: false,
        aboveDepth: '',
        belowDepth: '',
        region: {
            division: '',
            district: '',
            upazila: '',
            union: '',
            mouza: '',
        },
    });

    const { data: token } = useAccessToken()

    const dropdownQuery = useQuery({
        queryKey: ['dropdownData'],
        queryFn: fetchDropdownData,
    });

    const wellsQuery = useQuery<Well[]>({
        queryKey: ['wells', token?.id, queryParams],
        enabled: !!token,
        queryFn: async () => {
            const urlParams = new URLSearchParams(queryParams).toString();
            const url = urlParams
                ? `/api/v1/self/wells/query?${urlParams}`
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

    const guestWellsQuery = useQuery<Well[]>({
        queryKey: ['guestWells'],
        enabled: !token,
        queryFn: async () => {
            const stored = localStorage.getItem('unclaimedWellIds');
            if (!stored) return [];
    
            const ids: string[] = JSON.parse(stored);
            const responses = await Promise.all(ids.map(id =>
                fetch(`/api/v1/self/well/${id}`).then(res => res.json())
            ));
    
            return responses.map(w =>
                WellSchema.parse({ ...w, createdAt: new Date(w.createdAt) })
            );
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

    useEffect(() => {
        const params = new URLSearchParams();
    
        if (filters.wellInUse) params.append("wellInUse", "true");
        if (filters.geolocated) params.append("geolocated", "true");
        if (filters.hasImages) params.append("hasImages", "true");
        if (filters.complete) params.append("complete", "true");
    
        if (filters.flooding) params.append("flooding", filters.flooding);
        if (filters.staining) params.append("staining", filters.staining);
    
        if (filters.aboveDepth) params.append("depth_gte", filters.aboveDepth);
        if (filters.belowDepth) params.append("depth_lte", filters.belowDepth);
    
        const region = filters.region;
        if (region.division) params.append("division", region.division);
        if (region.district) params.append("district", region.district);
        if (region.upazila) params.append("upazila", region.upazila);
        if (region.union) params.append("union", region.union);
        if (region.mouza) params.append("mouza", region.mouza);
    
        setQueryParams(Object.fromEntries(params.entries()));
    }, [filters]);

    if (dropdownQuery.isLoading) {
        return <CircularProgress />;
    }

    const wells = token ? wellsQuery.data : guestWellsQuery.data;

    return (
        <>
            <TranslatableText 
                english='My Wells' 
                bengali='BENGALI PLACEHOLDER'
                textAlign='center'
                variant='h4'
            />

            {!token && (
                <Alert severity="warning" sx={{ margin: "1rem" }}>
                    <TranslatableText
                        variant='body1'
                        english='You are not logged in. Wells you create will not be saved to your account until you sign in.'
                        bengali='BENGALI PLACEHOLDER'
                    />
                </Alert>
            )}

            <Button onClick={addWell} variant="contained">
                <TranslatableText
                    variant='body1'
                    english='Add Well'
                    bengali='BENGALI PLACEHOLDER'
                />
            </Button>

            {token && dropdownQuery.data && (
                <Filter
                    dropdownData={dropdownQuery.data}
                    filters={filters}
                    setFilters={setFilters}
                    filterOpen={filterOpen}
                    setFilterOpen={setFilterOpen}
                />
            )}


            <Box sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem', width: '100%' }}>
                {(
                    wells?.length === 0 && !(token ? wellsQuery.isLoading : guestWellsQuery.isLoading)
                ) ? (
                    <TranslatableText
                        variant='body1'
                        english='No wells found' 
                        bengali='BENGALI PLACEHOLDER' 
                    />
                ) : (
                    wells?.map(well => (
                        <WellCard
                            key={well.id}
                            well={well}
                        />
                    ))
                )}
            </Box>
        </>
    );
}
