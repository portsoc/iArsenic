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
}

export default function TranslatableText({ 
    english, 
    bengali, 
    variant, 
    align, 
    gutterBottom = false, 
    mb, 
    textAlign,
}: props): JSX.Element {
    return (
        <>
            <Typography
                className="english"
                variant={variant}
                align={align}
                gutterBottom={gutterBottom}
                sx={{ mb, textAlign }}
            >
                {english}
            </Typography>
            
            <Typography
                className="bengali"
                variant={variant}
                align={align}
                gutterBottom={gutterBottom}
                sx={{ mb, textAlign }}
            >
                {bengali}
            </Typography>
        </>
    );
}
