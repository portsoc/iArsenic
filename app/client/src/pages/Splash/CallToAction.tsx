import { Box, useTheme, Button } from '@mui/material';
import TranslatableText from '../../components/TranslatableText';

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

interface props {
    tryAppClick: () => void;
}

export default function CallToAction({ tryAppClick }: props): JSX.Element {
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
                src={`/splashPage/man_pumping_well.jpg`}
                alt="Background"
                style={backgroundImageStyle}
            />

            <TranslatableText
                variant='h2' 
                sx={fontStyle}
                english='iArsenic'
                bengali='BENGALI PLACEHOLDER'
            />

            <TranslatableText
                variant='h5' 
                gutterBottom 
                sx={fontStyle}
                english='Instant arsenic screening of hand pump tubewells in Bangladesh using online technology'
                bengali='BENGALI PLACEHOLDER'
            />

            <Button
                variant='contained'
                color='primary'
                size='large'
                sx={{ padding: '1rem 2rem', fontSize: '1.2rem' }}
                onClick={tryAppClick}
            >
                <TranslatableText 
                    variant='body1' 
                    english='Try the App'
                    bengali='BENGALI PLACEHOLDER'
                />
            </Button>
        </Box>
    );
}
