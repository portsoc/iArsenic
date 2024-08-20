import { Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function SignUp(): JSX.Element {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
    }

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    function handleConfirmPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setConfirmPassword(event.target.value);
    }

    function validatePassword(password: string): string | null {
        if (password.length < 10) {
            return "Password must be at least 10 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must contain at least one symbol.";
        }
        return null;
    }

    function handleSubmit() {
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError(null);

        // Handle sign-up logic here
        console.log('Sign up with:', { name, email, password });
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
                    Sign Up
                </Typography>

                <TextField
                    label="Name"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    sx={{ width: '85%' }}
                />

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    sx={{ width: '85%' }}
                />

                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    sx={{ width: '85%' }}
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    sx={{ width: '85%' }}
                />

                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}

                <Button
                    sx={{ width: '90%', height: '3rem' }}
                    variant='contained'
                    onClick={handleSubmit}
                >
                    Sign Up
                </Button>
            </Card>
        </>
    );
}
