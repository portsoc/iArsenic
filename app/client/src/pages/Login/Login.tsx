import { Button, Card, TextField } from '@mui/material';
import { useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import { useLogin } from '../../utils/useLogin';
import TranslatableText from '../../components/TranslatableText';

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
                <TranslatableText 
                    textAlign='center'
                    mb='1rem'
                    variant='h4'
                    english='Login' 
                    bengali='BENGALI PLACEHOLDER'
                />

                <TextField
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    sx={{ width: '85%' }}
                    label={
                        <TranslatableText 
                            variant='body1'
                            english='Email' 
                            bengali='BENGALI PLACEHOLDER'
                        />
                    }
                />

                <TextField
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    sx={{ width: '85%' }}
                    label={
                        <TranslatableText 
                            variant='body1'
                            english='Password' 
                            bengali='BENGALI PLACEHOLDER'
                        />
                    }
                />

                {err && (
                    <TranslatableText 
                        variant='body1'
                        error={true}
                        english={err}
                        bengali='BENGALI PLACEHOLDER'
                    />
                )}

                <Button onClick={() => navigate(`/forgot-password`)}>
                    <TranslatableText 
                        variant='body1'
                        english='Forgot Password?'
                        bengali='BENGALI PLACEHOLDER'
                    />
                </Button>

                <Button
                    sx={{ width: '90%', height: '4rem' }}
                    variant='contained'
                    onClick={handleSubmit}
                    disabled={loginMutation.isPending}
                >
                    <TranslatableText 
                        variant='body1'
                        english={loginMutation.isPending ? 'Logging in...' : 'Login'}
                        bengali='BENGALI PLACEHOLDER'
                    />
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
                <TranslatableText 
                    variant='h5'
                    textAlign='center'
                    english="Don't have an account?"
                    bengali='BENGALI PLACEHOLDER'
                />

                <Button
                    sx={{ width: '90%', height: '4rem' }}
                    variant='outlined'
                    onClick={() => navigate(`/sign-up`)}
                >
                    <TranslatableText 
                        variant='body1'
                        english='Sign Up'
                        bengali='BENGALI PLACEHOLDER'
                    />
                </Button>
            </Card>
        </>
    );
}
