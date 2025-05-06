import { Typography, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import { Well } from 'iarsenic-types';
import { useRoute } from 'wouter';
import Depth from './Depth';
import Flooding from './Flooding';
import Region from './Region';
import Staining from './Staining';
import Drinking from './Drinking';
import Images from './Images';
import { useAccessToken } from '../../utils/useAccessToken';

export default function Review() {
    const [, params] = useRoute('/well/:id/review');
    const wellId = params?.id;
    const [well, setWell] = useState<Well>();
    const { data: token } = useAccessToken()

    useEffect(() => {
        async function fetchWell() {
            if (!wellId) return;

            const headers: HeadersInit = {};

            if (token) {
                headers['authorization'] = `Bearer ${token.id}`;
            }

            const result = await fetch(
                `/api/v1/self/well/${wellId}`, {
                    headers,
                }
            );

            if (!result.ok) {
                console.error('Failed to fetch well:', result);
                return;
            }

            const well = await result.json();

            setWell(well);
        }

        fetchWell();
    }, [token, wellId]);

    if (!well) {
        return (
            <CircularProgress />
        );
    }
    
    if (well.division == null) {
        navigate(`/well/${wellId}/region`);
        return;
    }
    if (well.staining == null) {
        navigate(`/well/${wellId}/staining`);
        return;
    }
    if (well.depth == null) {
        navigate(`/well/${wellId}/depth`);
        return;
    }
    if (well.flooding == null) {
        navigate(`/well/${wellId}/flooding`);
        return;
    }
    if (well.wellInUse == null) {
        navigate(`/well/${wellId}/well-in-use`);
        return;
    }

    return (
        <>
            <Typography variant="h4" gutterBottom textAlign="center">
                Review
            </Typography>

            <Region well={well} />
            <Staining well={well} />
            <Depth well={well} />
            <Flooding well={well} />
            <Drinking well={well} />
            <Images well={well} />

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'

                onClick={() => {
                    navigate(`/well/${wellId}/result`);
                }}
            >
                Results
            </Button>
        </>
    );
}
