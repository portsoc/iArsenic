import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { Well } from 'shared';
import { navigate } from 'wouter/use-browser-location';

interface props {
    well: Well;
}

export default function WellCard({ well }: props): JSX.Element {
    return (
        <Card
            variant="outlined"
            sx={{ marginBottom: '1.5rem', padding: '1rem', boxShadow: 2, cursor: 'pointer' }}
            onClick={() => navigate(`/well/${well.id}`)}
        >
            <CardContent>
                {/* Well ID */}
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                    Well ID: {well.id}
                </Typography>

                {/* Created Date */}
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Date Created: {new Date(well.createdAt).toLocaleDateString()}
                </Typography>

                {/* Region Details */}
                {well.regionKey && (
                    <Box mt={2}>
                        <Typography variant="subtitle1" color="text.primary">
                            Region
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {well.regionKey.division}, {well.regionKey.district}, {well.regionKey.upazila}, {well.regionKey.union}, {well.regionKey.mouza}
                        </Typography>
                    </Box>
                )}

                {/* Well Details in Grid */}
                <Grid container spacing={2} mt={2}>
                    {well.depth && (
                        <Grid item xs={6}>
                            <Typography variant="subtitle2">Depth</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {well.depth} meters
                            </Typography>
                        </Grid>
                    )}
                    {well.flooding !== undefined && (
                        <Grid item xs={6}>
                            <Typography variant="subtitle2">Flooding</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {well.flooding ? 'Yes' : 'No'}
                            </Typography>
                        </Grid>
                    )}
                    {well.staining && (
                        <Grid item xs={6}>
                            <Typography variant="subtitle2">Staining</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {well.staining}
                            </Typography>
                        </Grid>
                    )}
                </Grid>

                {/* Prediction Details */}
                {well.prediction && (
                    <Box mt={3}>
                        <Typography variant="subtitle1" color="text.primary">
                            Prediction
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2">Risk Assessment</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {well.prediction.riskAssesment}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2">Model Output</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {well.prediction.modelOutput}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
