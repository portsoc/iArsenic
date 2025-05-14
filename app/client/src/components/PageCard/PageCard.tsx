import { Card, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

interface StandardCardProps {
    children: ReactNode;
    sx?: SxProps<Theme>;
    variant?: "outlined" | "elevation";
}

export default function StandardCard({ children, sx, variant = "outlined" }: StandardCardProps) {
    return (
        <Card
            variant={variant}
            sx={{
                margin: "0 1rem 1rem 1rem",
                padding: "1rem",
                width: "100%",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                ...sx,
            }}
        >
            {children}
        </Card>
    );
}