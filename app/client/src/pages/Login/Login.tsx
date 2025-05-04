import { Button, Card, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import AccessTokenRepo from '../../utils/AccessTokenRepo';
import { AccessTokenSchema } from 'iarsenic-types';

export default function Login(): JSX.Element {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [err, setErr] = useState<string | null>(null);

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setErr(null);
        setEmail(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setErr(null);
        setPassword(event.target.value);
    }

    async function handleSubmit() {
        const result = await fetch(`/api/v1/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!result.ok) {
            if (result.status === 401) {
                setErr('Invalid email or password');
                return;
            }

            console.error('Failed to login:', result);
            return;
        }

        const data = await result.json();

        const token = data.accessToken;
        const validatedTokenRes = AccessTokenSchema.safeParse({
            ...token,
            createdAt: new Date(token.createdAt),
            expiresAt: new Date(token.expiresAt),
            revokedAt: token.revokedAt == null ?
                undefined :
                new Date(token.revokedAt),
        });

        if (!validatedTokenRes.success) {
            console.error(
                'Failed to validate access token:',
                validatedTokenRes.error,
            );

            return;
        }

        AccessTokenRepo.set(validatedTokenRes.data);

        navigate(`/my-wells`);
        window.location.reload();
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
                }}
            >
                <Typography marginBottom='1rem' textAlign='center' variant='h4'>
                    Login
                </Typography>

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

                {err && (
                    <Typography color='error'>
                        {err}
                    </Typography>
                )}

                <Button
                    onClick={() => navigate(`/forgot-password`)}
                >
                    Forgot Password?
                </Button>

                <Button
                    sx={{ width: '90%', height: '4rem' }}
                    variant='contained'
                    onClick={handleSubmit}
                >
                    Login
                </Button>
            </Card>

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
                }}
            >
                <Typography textAlign='center' variant='h5'>
                    Don't have an account?
                </Typography>

                <Button
                    sx={{ width: '90%', height: '4rem' }}
                    variant='outlined'
                    onClick={() => navigate(`/sign-up`)}
                >
                    Sign Up
                </Button>
            </Card>
        </>
    );
}
