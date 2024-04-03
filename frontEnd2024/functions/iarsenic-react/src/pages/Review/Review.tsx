import React from 'react';
import { Box, Typography, Card, Stepper, Step, StepLabel, Button } from '@mui/material';

const regionData = JSON.parse(localStorage.getItem('region') || '{"division":null,"district":null,"upazila":null,"union":null,"mouza":null}');
const depthData = localStorage.getItem('depth') || 'Unknown depth';
const stainingData = JSON.parse(localStorage.getItem('staining') || '{"staining":null}');

export default function Review() {
    const steps = ['Select Region', 'Staining', 'Depth'];

    // Function to determine the completed steps based on the localStorage data
    const activeStep = () => {
        if (stainingData.staining && depthData !== 'Unknown depth') {
            return 3;
        } else if (stainingData.staining || depthData !== 'Unknown depth') {
            return 2;
        }
        return 1;
    };

    return (
        <Box width="100%" height="100%" p={2} bgcolor="background.default">
            <Stepper alternativeLabel activeStep={activeStep()} sx={{ marginBottom: '20px' }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Typography variant="h4" gutterBottom textAlign="center">
                Review
            </Typography>

            <Card variant="outlined" sx={{ padding: '16px', marginBottom: '16px' }}>
                <Typography variant="h6" gutterBottom>
                    Region:
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Div: {regionData.division || 'Not set'}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Dis: {regionData.district || 'Not set'}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Upa: {regionData.upazila || 'Not set'}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Uni: {regionData.union || 'Not set'}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Mou: {regionData.mouza || 'Not set'}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Staining: {stainingData.staining || 'Not set'}
                </Typography>
                <Typography variant="body1" component="p">
                    Depth: {depthData}
                </Typography>
            </Card>

            <Button variant="contained" sx={{ width: '100%', height: '56px', marginBottom: '16px' }}>
                Results
            </Button>
        </Box>
    );
}
