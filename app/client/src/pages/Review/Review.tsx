import { Box, Typography, Card, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import config from '../../config';
import { AccessToken, Well } from 'shared';
import AccessTokenRepo from '../../utils/AccessTokenRepo';
import { useRoute } from 'wouter';

export default function Review() {
    const [, params] = useRoute('/:id/review');
    const wellId = params?.id;
    const [token, setToken] = useState<AccessToken>();
    const [well, setWell] = useState<Well>();

    useEffect(() => {
        async function fetchToken() {
            const token = await AccessTokenRepo.get();
            if (token == null) return;

            setToken(token);
        }

        fetchToken();
    }, []);

    useEffect(() => {
        async function fetchWell() {
            if (!wellId) return;

            const headers: HeadersInit = {};

            if (token) {
                headers['authorization'] = `Bearer ${token.id}`;
            }

            const result = await fetch(
                `${config.basePath}/api/v1/self/well/${wellId}`, {
                    headers,
                }
            );

            if (!result.ok) {
                console.error('Failed to fetch well:', result);
                return;
            }

            const data = await result.json();

            setWell(data.well);
        }

        fetchWell();
    }, [token, wellId]);

    if (!well) {
        return (
            <CircularProgress />
        );
    }

    if (well.regionKey == null) {
        navigate(`${config.basePath}/${wellId}/region`);
        return;
    }
    if (well.depth == null) {
        navigate(`${config.basePath}/${wellId}/depth`);
        return;
    }
    if (well.staining == null) {
        navigate(`${config.basePath}/${wellId}/staining`);
        return;
    }
    if (well.flooding == null) {
        navigate(`${config.basePath}/${wellId}/flooding`);
        return;
    }

    return (
        <>
            <Typography variant="h4" gutterBottom textAlign="center">
                Review
            </Typography>

            <Card
                variant="outlined"
                sx={{
                    width: '100%',
                    padding: '16px',
                    marginBottom: '16px',
                }}
            >
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>Region</Typography>

                    <Typography variant="body1" component="p" gutterBottom>
                        Division: {well.regionKey.division}
                    </Typography>

                    <Typography variant="body1" component="p" gutterBottom>
                        District: {well.regionKey.district}
                    </Typography>

                    <Typography variant="body1" component="p" gutterBottom>
                        Upazila: {well.regionKey.upazila}
                    </Typography>

                    <Typography variant="body1" component="p" gutterBottom>
                        Union: {well.regionKey.union}
                    </Typography>

                    <Typography variant="body1" component="p" gutterBottom>
                        Mouza: {well.regionKey.mouza}
                    </Typography>
                </Box>

                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>Staining</Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Staining: {well.staining}
                    </Typography>

                    {well.utensilStaining && (
                        <Typography variant="body1" component="p" gutterBottom>
                            Utensil Staining: {well.utensilStaining}
                        </Typography>
                    )}
                </Box>

                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>Depth</Typography>
                    <Typography variant="body1" component="p">
                        Depth: {well.depth} meters
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>Flooding</Typography>
                    <Typography variant="body1" component="p">
                        Flooding: {well.flooding ? 'Yes' : 'No'}
                    </Typography>
                </Box>
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'

                onClick={() => {
                    if (token) {
                        navigate(`${config.basePath}/well/${wellId}`);
                        return;
                    }
                    navigate(`${config.basePath}/${wellId}/result`);
                }}
            >
                Results
            </Button>
        </>
    );
}
