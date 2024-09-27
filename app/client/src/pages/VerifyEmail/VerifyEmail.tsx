import { useState, useEffect } from "react";
import { CircularProgress, Typography, Box, Alert } from "@mui/material";
import { useRoute } from "wouter";

export default function Review() {
    const [, params] = useRoute('/verify-email/:id');
    const verifyEmailTokenId = params?.id;

    // State to handle loading, success, and error status
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        async function verifyEmail(tokenId: string) {
            try {
                const result = await fetch(
                    `/api/v1/user/verify-email/${tokenId}`
                );

                if (!result.ok) {
                    console.error('Failed to verify email:', result);
                    setSuccess(false);
                    return;
                }

                const data = await result.json();
                console.log(data);
                setSuccess(true); // Email verified successfully
            } catch (error) {
                console.error('Error verifying email:', error);
                setSuccess(false);
            } finally {
                setLoading(false); // Stop loading when done
            }
        }

        if (verifyEmailTokenId) {
            verifyEmail(verifyEmailTokenId);
            console.log('Verifying email...');
        } else {
            console.log('No token provided');
            setLoading(false); // No token, so stop loading
        }
    }, [verifyEmailTokenId]);

    return (
        <>
            <Typography variant="h4" gutterBottom textAlign="center">
                Verify Email
            </Typography>

            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={4}>
                {loading && (
                    <CircularProgress />
                )}

                {!loading && success === true && (
                    <Alert severity="success">
                        Email verified successfully!
                    </Alert>
                )}

                {!loading && success === false && (
                    <Alert severity="error">
                        Something went wrong. Failed to verify email.
                    </Alert>
                )}

                {!loading && success === null && (
                    <Alert severity="warning">
                        No token provided for email verification.
                    </Alert>
                )}
            </Box>
        </>
    );
}
