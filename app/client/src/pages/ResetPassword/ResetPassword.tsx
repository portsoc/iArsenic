import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useRoute } from "wouter";
import TranslatableText from "../../components/TranslatableText";
import PageCard from "../../components/PageCard";

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

    // TODO create single function for this
    function validatePassword(password: string): string | null {
        if (password.length < 10) {
            return "Password must be at least 10 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must contain at least one special character.";
        }
        return null;
    }

    async function handlePasswordReset() {
        if (!newPassword) return;

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

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
            <PageCard>
                <TranslatableText 
                    mb='1rem' 
                    textAlign='center' 
                    variant='h4'
                    english='Reset Password'
                    bengali='BENGALI PLACEHOLDER'
                />

                {success ? (
                    <TranslatableText 
                        mb='1rem' 
                        textAlign='center' 
                        variant='h4'
                        english='Your password has been reset successfully.'
                        bengali='BENGALI PLACEHOLDER'
                    />
                ) : (
                    <>
                        <TextField
                            type="password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            sx={{ width: '85%' }}
                            disabled={isSubmitting}
                            label={
                                <TranslatableText 
                                    mb='1rem' 
                                    textAlign='center' 
                                    variant='body1'
                                    english='New Password'
                                    bengali='BENGALI PLACEHOLDER'
                                />
                            }
                        />

                        <TextField
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            sx={{ width: '85%' }}
                            disabled={isSubmitting}
                            label={
                                <TranslatableText 
                                    mb='1rem' 
                                    textAlign='center' 
                                    variant='body1'
                                    english='Confirm Password'
                                    bengali='BENGALI PLACEHOLDER'
                                />
                            }
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
                            <TranslatableText 
                                mb='1rem' 
                                textAlign='center' 
                                variant='h4'
                                error={true}
                                english={error}
                                bengali='BENGALI PLACEHOLDER'
                            />
                        )}
                    </>
                )}
            </PageCard>
        </>
    );
}
