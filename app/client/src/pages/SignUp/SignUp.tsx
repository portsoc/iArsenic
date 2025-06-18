import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { IKnownError, RegisterRequestSchema } from 'iarsenic-types';
import { useLanguage } from '../../utils/useLanguage';
import TranslatableText from '../../components/TranslatableText';
import PageCard from '../../components/PageCard';

export default function SignUp(): JSX.Element {
    const { language } = useLanguage()
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
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
            if (language === 'english') {
                return "Password must be at least 10 characters long.";
            } else {
                return "BENGALI PLACEHOLDER";
            }
        }
        if (!/[A-Z]/.test(password)) {
            if (language === 'english') {
                return "Password must contain at least one uppercase letter.";
            } else {
                return "BENGALI PLACEHOLDER";
            }
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            if (language === 'english') {
                return "Password must contain at least one symbol.";
            } else {
                return "BENGALI PLACEHOLDER";
            }
        }
        return null;
    }

    async function handleSubmit() {
        if (!name || !email || !password || !confirmPassword) {
            if (language === 'english') {
                setError('All fields are required');
            } else {
                setError('BENGALI PLACEHOLDER');
            }
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            if (language === 'english') {
                setError("Passwords do not match");
            } else {
                setError('BENGALI PLACEHOLDER');
            }
            return;
        }

        setError(null);

        const units = language == 'english' ? 'meters' : 'feet';

        const registerBody = RegisterRequestSchema.parse({
            email: email,
            password: password,
            name: name,
            language,
            units,
        });

        const result = await fetch(`/api/v1/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerBody),
        });

        const resBody = await result.json();

        if (!result.ok) {
            if (resBody.knownError === true) {
                const knownError: IKnownError = resBody;

                if (knownError.name === 'ValidationError') {
                    setError(knownError.message);
                    return;
                }
            }

            setError(`Failed to sign up, request id: ${resBody.requestId}`);
            return;
        }
        const unclaimedWellIds = JSON.parse(localStorage.getItem("unclaimedWellIds") || "[]");

        if (Array.isArray(unclaimedWellIds) && unclaimedWellIds.length > 0) {
            await fetch(`/api/v1/self/wells/claim`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${resBody.token.id}`,
                },
                body: JSON.stringify({ guestWellIds: unclaimedWellIds }),
            });

            localStorage.removeItem("unclaimedWellIds");
        }

        alert('Sign up successful!');
    }

    return (
        <>
            <PageCard>
                <TranslatableText
                    marginBottom='1rem' 
                    textAlign='center' 
                    variant='h4'
                    english='Sign Up'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TextField
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    sx={{ width: '85%' }}
                    label={
                        <TranslatableText
                            variant='body1'
                            english='Name'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    }
                />

                <TextField
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    sx={{ width: '85%' }}
                    label={
                        <TranslatableText
                            variant='body1'
                            english='email'
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

                <TextField
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    sx={{ width: '85%' }}
                    label={
                        <TranslatableText 
                            variant='body1'
                            english="Confirm Password"
                            bengali='BENGALI PLACEHOLDER'
                        />
                    }
                />

                {error && (
                    <TranslatableText 
                        error={true}
                        variant="body2"
                        english={error}
                        bengali='BENGALI PLACEHOLDER'
                    />
                )}

                <Button
                    sx={{ width: '90%', height: '4rem' }}
                    variant='contained'
                    onClick={handleSubmit}
                >
                    <TranslatableText 
                        variant='body1'
                        english="Sign Up"
                        bengali='BENGALI PLACEHOLDER'
                    />
                </Button>
            </PageCard>
        </>
    );
}
