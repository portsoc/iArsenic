import { Typography, Box, useTheme, Button } from '@mui/material';
import { navigate } from 'wouter/use-browser-location';
import config from '../../config';

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
    textAlign: 'center',
    color: 'white',
    overflow: 'hidden',
    rowGap: '3rem',
    position: 'relative',
};

const fontStyle = {
    color: 'whitesmoke',
    textAlign: 'justify',
    m: 4,
    mb: '2rem',
};

const backgroundImageStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: -1,
    filter: 'brightness(0.5)',
};
export default function CallToAction(): JSX.Element {
    const theme = useTheme();

    return (
        <Box
            sx={{
                ...sectionStyle,
                borderImageSource: `linear-gradient(
                    ${theme.palette.primary.main}55,
                    ${theme.palette.secondary.main}55
                )`,
                borderImageSlice: 'fill 1',
                borderImageOpacity: 1,
            }}
        >
            <img
                src={`${config.basePath}/splashPage/man_pumping_well.jpg`}
                alt="Background"
                style={backgroundImageStyle}
            />
            <Typography variant='h2' sx={fontStyle}>
                iArsenic
            </Typography>
            <Typography variant='h5' gutterBottom sx={fontStyle}>
                Instant arsenic screening of hand pump tubewells in Bangladesh using online technology
            </Typography>
            <Button
                variant='contained'
                color='primary'
                size='large'
                onClick={() => navigate(`${config.basePath}/landing`)}
                sx={{ padding: '1rem 2rem', fontSize: '1.2rem' }}
            >
                Try the App!
            </Button>
        </Box>
    );
}
