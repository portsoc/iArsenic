import { Typography, TypographyProps } from '@mui/material';
import { ReactNode } from 'react';

interface TranslatableTextProps extends Omit<TypographyProps, 'children'> {
    english: ReactNode;
    bengali: ReactNode;
    mb?: string | number;
    textAlign?: TypographyProps['align'];
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
    ...rest
}: TranslatableTextProps): JSX.Element {
    const baseStyle = {
        mb,
        textAlign,
        color: error ? 'error.main' : rest.color,
        ...rest.sx,
    };

    return (
        <>
            <Typography
                className="english"
                variant={variant}
                align={align}
                gutterBottom={gutterBottom}
                sx={baseStyle}
                {...rest}
            >
                {english}
            </Typography>

            <Typography
                className="bengali"
                variant={variant}
                align={align}
                gutterBottom={gutterBottom}
                sx={baseStyle}
                {...rest}
            >
                {bengali}
            </Typography>
        </>
    );
}
