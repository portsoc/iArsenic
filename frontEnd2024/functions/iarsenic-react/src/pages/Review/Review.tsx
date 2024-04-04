import { Box, Typography, Card, Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import config from '../../config';

export default function Review() {
    const [regionData, setRegionData] = useState<{
        division: string,
        district: string,
        upazila: string,
        union: string,
        mouza: string,
    }>();
    const [depth, setDepth] = useState<{ depth: number, unit: 'meters' | 'ft' }>();
    const [staining, setStaining] = useState<string>();

    useEffect(() => {
        const regionStr = JSON.parse(localStorage.getItem('region') || '{}')

        if (regionStr.division) {
            setRegionData(regionStr);
        } else {
            setRegionData({
                division: 'null',
                district: 'null',
                upazila: 'null',
                union: 'null',
                mouza: 'null',
            });
        }

        const depthStr = JSON.parse(localStorage.getItem('depth') || '{}')
        if (depthStr.depth) {
            setDepth(depthStr);
        } else {
            setDepth({ depth: 0, unit: 'meters' });
        }

        const stainingStr = JSON.parse(localStorage.getItem('staining') || '{}')
        if (stainingStr.well) {
            setStaining(stainingStr.well);
        } else if (stainingStr.utensil) {
            setStaining(stainingStr.utensil);
        } else {
            setStaining('null');
        }
    }, [])

    if (!regionData || !depth || !staining) {
        return (
            <CircularProgress />
        )
    }

    const region = {
        division: regionData?.division,
        district: regionData?.district,
        upazila: regionData?.upazila,
        union: regionData?.union,
        mouza: regionData?.mouza
    }

    return (
        <Box width="100%" height="100%" p={2} bgcolor="background.default">
            <Typography variant="h4" gutterBottom textAlign="center">
                Review
            </Typography>

            <Card variant="outlined" sx={{ padding: '16px', marginBottom: '16px' }}>
                <Typography variant="h6" gutterBottom>Region</Typography>

                <Typography variant="body1" component="p" gutterBottom>
                    Division: {region.division || 'Not set'}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    District: {region.district || 'Not set'}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Upazila: {region.upazila || 'Not set'}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Union: {region.union || 'Not set'}
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Mouza: {region.mouza || 'Not set'}
                </Typography>

                <Typography variant="h6" gutterBottom>Staining</Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Staining: {staining || 'Not set'}
                </Typography>

                <Typography variant="h6" gutterBottom>Depth</Typography>
                <Typography variant="body1" component="p">
                    Depth: {depth.depth} {depth.unit}
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
                    navigate(`${config.basePath}/result`)
                }}
            >
                Results
            </Button>
        </Box>
    );
}
