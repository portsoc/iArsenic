import { Box, Button, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
    title: string;
    onNext: () => void;
    children: ReactNode;
    nextText?: string;
}

export default function WellAssessmentPageLayout({
    title,
    onNext,
    children,
    nextText = 'Next Step',
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
