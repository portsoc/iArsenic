import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useRoute } from "wouter";

export default function Review() {
    const [, params] = useRoute('/verify-email/:id');
    const verifyEmailTokenId = params?.id;

    useEffect(() => {
        async function verifyEmail(tokenId: string) {
            const result = await fetch(
                `/api/v1/user/verify-email/${tokenId}`
            );

            if (!result.ok) {
                console.error('Failed to verify email:', result);
                return;
            }

            const data = await result.json();
            console.log(data);
        }

        if (verifyEmailTokenId) {
            verifyEmail(verifyEmailTokenId);
            console.log('Verifying email...');
        } else console.log('No token provided');
    }, [verifyEmailTokenId]);

    return (
        <>
            <Typography variant="h4" gutterBottom textAlign="center">
                Verify Email
            </Typography>
        </>
    );
}
