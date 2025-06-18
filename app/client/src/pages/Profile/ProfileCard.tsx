import { Box, Button } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { User } from 'iarsenic-types';
import PageCard from '../../components/PageCard';
import TranslatableText from '../../components/TranslatableText';

interface Props {
    user: User;
    setEditMode: (editMode: boolean) => void;
}

export default function ProfileCard({ user, setEditMode }: Props): JSX.Element {
    return (
        <Box width='100%'>
           <TranslatableText 
                width='100%'
                textAlign='center' 
                variant='h4'
                mb='1rem'
                english='Profile Page'
                bengali='BENGALI PLACEHOLDER'
            />

            <PageCard>
                <TranslatableText 
                    width='100%'
                    variant='body1'
                    english={
                        <>
                            <strong>Name</strong> {user.name}
                        </>
                    }
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1'
                    english={
                        <>
                            <strong>Email</strong> {user.email}
                        </>
                    }
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1'
                    english={
                        <>
                            <strong>Email Verified</strong> {user.emailVerified ? "Yes" : "No"}
                        </>
                    }
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1'
                    english={
                        <>
                            <strong>User Type</strong> {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                        </>
                    }
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1'
                    english={
                        <>
                            <strong>Created At</strong> {user.createdAt.toLocaleDateString()}
                        </>
                    }
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1'
                    english={
                        <>
                            <strong>Language</strong> {user.language}
                        </>
                    }
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1'
                    english={
                        <>
                            <strong>Units System</strong> {user.units}
                        </>
                    }
                    bengali='BENGALI PLACEHOLDER'
                />

                <Box width='100%'>
                    <Button
                        variant='outlined'
                        startIcon={<CreateIcon />}
                        sx={{ mt: 2 }}
                        onClick={() => setEditMode(true)}
                    >
                        <TranslatableText 
                            width='100%'
                            variant='body1'
                            english='Edit Profile'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </Button>
                </Box>
            </PageCard>
        </Box>
    );
}
