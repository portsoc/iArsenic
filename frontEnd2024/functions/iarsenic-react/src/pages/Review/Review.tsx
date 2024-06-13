import { Box, Typography, Card, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import config from '../../config';
import PredictorsStorage, { Predictors } from '../../utils/PredictorsStorage';

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

        setPredictors({
            regionKey: predictors.regionKey,
            depth: predictors.depth,
            wellStaining: predictors.wellStaining,
            utensilStaining: predictors.utensilStaining
        });
    }, []);

    if (!predictors) {
        return (
            <CircularProgress />
        );
    }

    return (
        <Box width="100%" height="100%" p={2} bgcolor="background.default">
            <Typography variant="h4" gutterBottom textAlign="center">
                Review
            </Typography>

            <Card variant="outlined" sx={{ padding: '16px', marginBottom: '16px' }}>
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

                <Typography variant="h6" gutterBottom>Staining</Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Staining: {predictors.wellStaining}
                </Typography>

                {predictors.utensilStaining && (
                    <Typography variant="body1" component="p" gutterBottom>
                        Utensil Staining: {predictors.utensilStaining}
                    </Typography>
                )}

                <Typography variant="h6" gutterBottom>Depth</Typography>
                <Typography variant="body1" component="p">
                    Depth: {predictors.depth.value} {predictors.depth.unit}
                </Typography>
            </Card>

            <Button
                variant="contained"
                sx={{
                    width: '100%',
                    height: '56px',
                    marginBottom: '16px'
                }}
                onClick={() => {
                    navigate(`${config.basePath}/result`);
                }}
            >
                Results
            </Button>
        </Box>
    );
}
