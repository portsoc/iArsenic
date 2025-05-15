import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface props {
    english: ReactNode;
    bengali: ReactNode;
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'subtitle1' | 'subtitle2' | 'caption';
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    gutterBottom?: boolean;
    mb?: string | number;
    textAlign?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    error?: boolean;
}

export default function TranslatableText({ 
    english, 
    bengali, 
    variant, 
    align, 
    gutterBottom = false, 
    mb, 
    textAlign,
    error,
}: props): JSX.Element {
    const baseStyle = {
        mb,
        textAlign,
        color: error ? 'error.main' : undefined,
    };

    return (
        <>
            <Typography
                className="english"
                variant={variant}
                align={align}
                gutterBottom={gutterBottom}
                sx={baseStyle}
            >
                {english}
            </Typography>
            
            <Typography
                className="bengali"
                variant={variant}
                align={align}
                gutterBottom={gutterBottom}
                sx={baseStyle}
            >
                {bengali}
            </Typography>
        </>
    );
}
