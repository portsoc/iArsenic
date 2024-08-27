import { Button, Card, Typography } from '@mui/material';
import WellCard from './WellCard';
import { useEffect, useState } from 'react';
import { Well } from '../../../types';
import AccessToken from '../../utils/AccessToken';
import { navigate } from 'wouter/use-browser-location';
import Config from '../../config';

export default function MyWells(): JSX.Element {
    const [wells, setWells] = useState<Well[]>([]);

    async function fetchUserWells() {
        const token = await AccessToken.get();

        if (!token) {
            navigate(`${Config.basePath}/login`);
            return;
        }

        const result = await fetch(`${Config.basePath}/api/v1/self/wells`, {
            headers: {
                authorization: `Bearer ${token.id}`,
            }
        })

        if (!result.ok) {
            console.error('Failed to fetch wells:', result);
            return;
        }

        const data = await result.json();

        setWells(data.wells.map((well: any) => {
            return {
                id: well.id,
                createdAt: new Date(well.createdAt),
                regionKey: well.regionKey,
                depth: well.depth,
                flooding: well.flooding,
                staining: well.staining,
                prediction: well.prediction,
            }
        }))
    }

    async function addWell() {
        const token = await AccessToken.get();

        if (!token) {
            navigate(`${Config.basePath}/login`);
            return;
        }

        const result = await fetch(`${Config.basePath}/api/v1/self/well`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token.id}`,
            }
        })

        if (!result.ok) {
            console.error('Failed to add well:', result);
            return;
        }

        await fetchUserWells();
    }

    useEffect(() => {
        fetchUserWells();
    }, [])

    return (
        <>
            <Typography alignSelf='center' variant="h4">
                My Wells
            </Typography>

            <Card
                sx={{
                    margin: '0 1rem 1rem 1rem',
                    padding: '1rem',
                }}
            >

                {wells.map(well => (
                    <WellCard key={well.id} well={well} />
                ))}
            </Card>

            <Button
                onClick={() => { addWell() }}
                variant='contained'
            >
                Add Well
            </Button>
        </>
    );
};
