import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import TranslatableText from '../TranslatableText';

interface Props {
    title: ReactNode;
    onNext: () => Promise<void>;
    children: ReactNode;
    nextText?: ReactNode;
}

export default function WellAssessmentPageLayout({
    title,
    onNext,
    children,
    nextText = <TranslatableText
        variant="button"
        english="Next Step"
        bengali="পরবর্তী ধাপে যান"
    />,
}: Props): JSX.Element {
    const [changingPage, setChangingPage] = useState(false)

    return (
        <>
            <Typography marginBottom='1rem' textAlign='center' variant='h4'>
                {title}
            </Typography>

            <Box
                sx={{
                    margin: '0 1rem 1rem 1rem',
                    padding: '1rem',
                    width: '100%',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                {children}
            </Box>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                disabled={changingPage}
                onClick={async () => {
                    setChangingPage(true)
                    try {
                        await onNext()
                    } finally {
                        setChangingPage(false)
                    }
                }}
            >
                {changingPage ? 
                    <CircularProgress /> :
                    nextText
                }
            </Button>
        </>
    );
}
