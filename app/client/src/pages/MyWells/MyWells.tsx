import { Box, Button, Typography } from '@mui/material';
import WellCard from './WellCard';
import { useEffect, useState } from 'react';
import { Well } from 'shared';
import AccessTokenRepo from '../../utils/AccessTokenRepo';
import { navigate } from 'wouter/use-browser-location';

export default function MyWells(): JSX.Element {
    const [wells, setWells] = useState<Well[]>([]);

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

        const data = await result.json();

        setWells(data.wells.map((well: Well) => {
            return {
                id: well.id,
                createdAt: new Date(well.createdAt),
                regionKey: well.regionKey,
                depth: well.depth,
                flooding: well.flooding,
                staining: well.staining,
                prediction: well.prediction,
            };
        }));
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

        const data = await res.json();
        return data.well as Well;
    }

    useEffect(() => {
        fetchUserWells();
    }, []);

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
                    <WellCard key={well.id} well={well} />
                ))}
            </Box>
        </>
    );
}
