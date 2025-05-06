import { Button, Card, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import { useLogin } from '../../utils/useLogin';

export default function Login(): JSX.Element {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | null>(null);

    const loginMutation = useLogin();

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setErr(null);
        setEmail(event.target.value);
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setErr(null);
        setPassword(event.target.value);
    }

    async function handleSubmit() {
        try {
            await loginMutation.mutateAsync({ email, password });
        } catch (error: any) {
            setErr(error.message ?? 'Something went wrong');
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
                    <Typography color='error'>{err}</Typography>
                )}

                <Button onClick={() => navigate(`/forgot-password`)}>
                    Forgot Password?
                </Button>

                <Button
                    sx={{ width: '90%', height: '4rem' }}
                    variant='contained'
                    onClick={handleSubmit}
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
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
