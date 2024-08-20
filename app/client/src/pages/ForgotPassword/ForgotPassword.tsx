import { Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function ForgotPassword(): JSX.Element {
    const [email, setEmail] = useState<string>("");

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handlePasswordReset() {
        console.log('Sending password reset link to:', email);
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

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    sx={{ width: '85%' }}
                />

                <Button
                    sx={{ width: '90%', height: '3rem' }}
                    variant='contained'
                    onClick={handlePasswordReset}
                >
                    Send Reset Link
                </Button>
            </Card>
        </>
    );
}
