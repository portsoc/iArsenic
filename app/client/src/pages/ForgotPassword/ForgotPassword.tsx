import { Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function ForgotPassword(): JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    async function handlePasswordReset() {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/v1/user/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                const resBody = await response.json();
                console.error(resBody);

                if (resBody.knownError) {
                    setError(resBody.message);
                } else {
                    setError('Failed to send reset link.');
                }
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <Card
                variant='outlined'
                sx={{
                    margin: '0 1rem 1rem 1rem',
                    padding: '1rem',
                    width: '100%',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    pb: '2rem',
                }}
            >
                <Typography marginBottom='1rem' textAlign='center' variant='h4'>
                    Forgot Password
                </Typography>

                {success ? (
                    <Typography>
                        If a account exists with this email,
                        a password reset link has been sent to it.
                    </Typography>
                ) : (
                    <>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            sx={{ width: '85%' }}
                            disabled={isSubmitting}
                        />

                        <Button
                            sx={{ width: '90%', height: '3rem' }}
                            variant='contained'
                            onClick={handlePasswordReset}
                            disabled={isSubmitting || !email}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                        </Button>

                        {error && (
                            <Typography color='red'>{error}</Typography>
                        )}
                    </>
                )}
            </Card>
        </>
    );
}
