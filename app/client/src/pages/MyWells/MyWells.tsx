import { Box, Button, Typography } from '@mui/material';
import WellCard from './WellCard';
import { useEffect, useState } from 'react';
import { AccessToken, Prediction, Well } from 'iarsenic-types';
import AccessTokenRepo from '../../utils/AccessTokenRepo';
import { navigate } from 'wouter/use-browser-location';
import findWellPredictions from '../../utils/findWellPredictions';

export default function MyWells(): JSX.Element {
    const [token, setToken] = useState<AccessToken>();
    const [wells, setWells] = useState<Well[]>([]);
    const [predictions, setPredictions] = useState<Prediction[]>([]);

    async function fetchUserWells() {
        const token = await AccessTokenRepo.get();

        if (!token) {
            navigate(`/login`);
            throw new Error('token not valid');
        }

        const result = await fetch(`/api/v1/self/wells`, {
            headers: {
                authorization: `Bearer ${token.id}`,
            }
        });

        if (!result.ok) {
            console.error('Failed to fetch wells:', result);
            return;
        }

        const wells = await result.json();

        setWells(wells.map((well: Well) => {
            return {
                id: well.id,
                createdAt: new Date(well.createdAt),
                regionKey: well.regionKey,
                depth: well.depth,
                flooding: well.flooding,
                staining: well.staining,
            };
        }));
    }

    async function getWellPredictions() {
        if (!token || !wells) return;
    
        // use body because query parameters might get too long
        const res = await fetch('/api/v1/prediction', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${token.id}`,
            },
            body: JSON.stringify({ wellIds: wells.map(w => w.id) })
          });
    
        if (!res.ok) {
            throw new Error(`Failed to fetch predictions: ${res.status}`);
        }
    
        const data = await res.json();
        setPredictions(data.predictions);
    }

    async function addWell(): Promise<Well> {
        const token = await AccessTokenRepo.get();

        if (!token) {
            navigate(`/login`);
            throw new Error('token not valid');
        }

        const res = await fetch(`/api/v1/self/well`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token.id}`,
            }
        });

        if (!res.ok) {
            throw new Error('Failed to add well');
        }

        const well = await res.json();
        return well as Well;
    }

    useEffect(() => {
        async function fetchToken() {
            const token = await AccessTokenRepo.get();
            if (token == null) return;

            setToken(token);
        }

        fetchToken()
    }, [])

    useEffect(() => {
        fetchUserWells();
    }, [token]);

    useEffect(() => {
        getWellPredictions();
    }, [wells]);

    return (
        <>
            <Typography alignSelf='center' variant="h4">
                My Wells
            </Typography>

            <Button
                onClick={async () => {
                    const newWell = await addWell();
                    navigate(`/${newWell.id}/region`);
                }}
                variant='contained'
            >
                Add Well
            </Button>

            <Box
                sx={{
                    margin: '0 1rem 1rem 1rem',
                    padding: '1rem',
                }}
            >

                {wells.map(well => (
                    <WellCard 
                        key={well.id} 
                        well={well} 
                        predictions={findWellPredictions(
                            well, 
                            predictions,
                        )}
                    />
                ))}
            </Box>
        </>
    );
}
