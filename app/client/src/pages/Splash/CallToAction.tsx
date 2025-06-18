import { Box, useTheme, Button, Avatar, Typography } from '@mui/material';
import TranslatableText from '../../components/TranslatableText';
import { useLanguage } from '../../utils/useLanguage';

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
    const { setLanguage } = useLanguage();
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
                bengali='iArsenic (আই আরসেনিক)'
            />

            <TranslatableText
                variant='h5' 
                gutterBottom 
                sx={fontStyle}
                english='Instant arsenic screening of hand pump tubewells in Bangladesh using online technology'
                bengali='আপনার নলকূপের পানিতে আর্সেনিক উপস্থিতির ঝুকি আছে কি না মুহূর্তেই যাচাই করুন'
            />

            <Typography variant='h4'>ভাষা নির্বাচন করুন / Select Language</Typography>

            <Box
                sx={{
                    height: 'max-content',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }} 
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '700px',
                        display: 'flex',
                        justifyContent: 'space-around'
                    }} 
                >
                    <Box
                        onClick={() => setLanguage('english')}
                    >
                        <Button
                            startIcon={
                                <Avatar
                                    sx={{ height: '100%', width: '8rem', borderRadius: '16px' }}
                                    src={`/british.png`}
                                />
                            }
                        />
                        <Typography variant='h5'>English</Typography>
                    </Box>

                    <Box
                        onClick={() => setLanguage('bengali')} 
                    >
                        <Button
                            startIcon={
                                <Avatar
                                    sx={{ height: '100%', width: '8rem', borderRadius: '16px' }}
                                    src={`/bangladesh.jpg`}
                                />
                            }
                        />
                        <Typography variant='h5'>বাংলা</Typography>
                    </Box>
                </Box>
            </Box>

            <Button
                variant='contained'
                color='primary'
                sx={{ 
                    height: '6rem',
                    width: '24rem',
                    maxWidth: '80%',
                    padding: '1rem 2rem', 
                }}
                onClick={tryAppClick}
            >
                <TranslatableText 
                    variant='h5' 
                    english='Try the App'
                    bengali='অ্যাপটি ব্যবহার করুন'
                />
            </Button>
        </Box>
    );
}
