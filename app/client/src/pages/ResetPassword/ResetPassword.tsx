import { Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useRoute } from "wouter";

export default function ResetPassword(): JSX.Element {
    const [, params] = useRoute('/reset-password/:token');
    const resetPasswordToken = params?.token;

    const [newPassword, setNewPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    function handleNewPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNewPassword(event.target.value);
    }

    function handleConfirmPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setConfirmPassword(event.target.value);
    }

    async function handlePasswordReset() {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/v1/user/reset-password/${resetPasswordToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            if (response.ok) {
                setSuccess(true);
            } else {
                const errorMessage = await response.text();
                setError(errorMessage || 'Failed to reset password.');
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
                    Reset Password
                </Typography>

                {success ? (
                    <Typography>
                        Your password has been reset successfully.
                    </Typography>
                ) : (
                    <>
                        <TextField
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            sx={{ width: '85%' }}
                            disabled={isSubmitting}
                        />

                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            sx={{ width: '85%' }}
                            disabled={isSubmitting}
                        />

                        <Button
                            sx={{ width: '90%', height: '3rem' }}
                            variant='contained'
                            onClick={handlePasswordReset}
                            disabled={isSubmitting || !newPassword || !confirmPassword}
                        >
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
