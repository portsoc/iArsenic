import { Box, Button, Typography } from '@mui/material';
import { ReactNode } from 'react';
import TranslatableText from '../TranslatableText';

interface Props {
    title: ReactNode;
    onNext: () => void;
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
                onClick={onNext}
            >
                {nextText}
            </Button>
        </>
    );
}
