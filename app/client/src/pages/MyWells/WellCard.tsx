import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Well } from '../../../types';

interface props {
    well: Well;
}

export default function WellCard({ well }: props): JSX.Element {
    return (
        <Card variant="outlined" sx={{ marginBottom: '1rem' }}>
            <CardContent>
                <Typography fontWeight='bold' component="div">
                    Well ID: {well.id}
                </Typography>
                <Typography component="div">
                    Date Created: {well.createdAt.toISOString()}
                </Typography>
                {well.regionKey && (
                    <Typography>
                        Region: {well.regionKey.division}, {well.regionKey.district}, {well.regionKey.upazila}, {well.regionKey.union}, {well.regionKey.mouza}
                    </Typography>
                )}
                {well.depth && (
                    <Typography>
                        Depth: {well.depth} meters
                    </Typography>
                )}
                {well.flooding && (
                    <Typography>
                        Flooding: {well.flooding}
                    </Typography>
                )}
                {well.staining && (
                    <Typography>
                        Staining: {well.staining}
                    </Typography>
                )}
                {well.prediction && (
                    <Box mt={2}>
                        <Typography>
                            Risk Assessment: {well.prediction.riskAssesment}
                        </Typography>
                        <Typography>
                            Model Output: {well.prediction.modelOutput}
                        </Typography>
                    </Box>
                )}

                <Button variant='outlined' sx={{ mx: 'auto' }}>Modify</Button>
            </CardContent>
        </Card>
    );
};
