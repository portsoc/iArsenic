import { Box, Typography, Card, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import config from '../../config';
import PredictorsStorage from '../../utils/PredictorsStorage';
import { Predictors } from '../../../../types';

export default function Review() {
    const [predictors, setPredictors] = useState<Predictors>();

    useEffect(() => {
        const storedPredictors = PredictorsStorage.get();
        const valid = PredictorsStorage.validate(storedPredictors);

        if (!valid.ok) {
            alert(valid.msg);
            navigate(`${config.basePath}/`);
        }

        const predictors = storedPredictors as Predictors;

        setPredictors(predictors);
    }, []);

    if (!predictors) {
        return (
            <CircularProgress />
        );
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
                        Division: {predictors.regionKey.division}
                    </Typography>

                    <Typography variant="body1" component="p" gutterBottom>
                        District: {predictors.regionKey.district}
                    </Typography>

                    <Typography variant="body1" component="p" gutterBottom>
                        Upazila: {predictors.regionKey.upazila}
                    </Typography>

                    <Typography variant="body1" component="p" gutterBottom>
                        Union: {predictors.regionKey.union}
                    </Typography>

                    <Typography variant="body1" component="p" gutterBottom>
                        Mouza: {predictors.regionKey.mouza}
                    </Typography>
                </Box>

                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>Staining</Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        Staining: {predictors.wellStaining}
                    </Typography>

                    {predictors.utensilStaining && (
                        <Typography variant="body1" component="p" gutterBottom>
                            Utensil Staining: {predictors.utensilStaining}
                        </Typography>
                    )}
                </Box>

                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>Depth</Typography>
                    <Typography variant="body1" component="p">
                        Depth: {predictors.depth.value} {predictors.depth.unit}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" gutterBottom>Flooding</Typography>
                    <Typography variant="body1" component="p">
                        Flooding: {predictors.flooding ? 'Yes' : 'No'}
                    </Typography>
                </Box>
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'

                onClick={() => {
                    navigate(`${config.basePath}/result`);
                }}
            >
                Results
            </Button>
        </>
    );
}
