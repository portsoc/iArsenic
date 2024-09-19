import { Box, Button, Typography } from '@mui/material';
import WellCard from './WellCard';
import { useEffect, useState } from 'react';
import { Well } from 'shared';
import AccessToken from '../../utils/AccessToken';
import { navigate } from 'wouter/use-browser-location';
import Config from '../../config';

export default function MyWells(): JSX.Element {
    const [wells, setWells] = useState<Well[]>([]);

    async function fetchUserWells() {
        const token = await AccessToken.get();

        if (!token || token.type !== 'access') {
            navigate(`${Config.basePath}/login`);
            throw new Error('token not valid');
        }

        if (token.type !== 'access') {
            console.error('Token is not access token');
            return;
        }

        const result = await fetch(`${Config.basePath}/api/v1/self/wells`, {
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
        const token = await AccessToken.get();

        if (!token || token.type !== 'access') {
            navigate(`${Config.basePath}/login`);
            throw new Error('token not valid');
        }

        const res = await fetch(`${Config.basePath}/api/v1/self/well`, {
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
                    navigate(`${Config.basePath}/${newWell.id}/region`);
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
