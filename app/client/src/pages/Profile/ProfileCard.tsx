import { Typography, Card, Box, Button } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { User } from 'shared';

interface Props {
    user: User;
    setEditMode: (editMode: boolean) => void;
}

export default function ProfileCard({ user, setEditMode }: Props): JSX.Element {
    return (
        <Box width='100%'>
           <Typography className='english' textAlign='center' variant='h4' gutterBottom>
                Profile Page
            </Typography>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem' }}>
                <Typography className='english' variant='body1' mb={2}>
                    <strong>Name</strong> {user.name}
                </Typography>

                <Typography className='english' variant='body1' mb={2}>
                    <strong>Email</strong> {user.email}
                </Typography>

                <Typography className='english' variant='body1' mb={2}>
                    <strong>Email Verified</strong> {user.emailVerified ? "Yes" : "No"}
                </Typography>

                <Typography className='english' variant='body1' mb={2}>
                    <strong>User Type</strong> {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                </Typography>

                <Typography className='english' variant='body1' mb={2}>
                    <strong>Created At</strong> {user.createdAt.toLocaleDateString()}
                </Typography>

                <Typography className='english' variant='body1' mb={2}>
                    <strong>Language</strong> {user.language}
                </Typography>

                <Typography className='english' variant='body1' mb={2}>
                    <strong>Units System</strong> {user.units}
                </Typography>

                {/* Add Edit Button */}
                <Button
                    variant='outlined'
                    startIcon={<CreateIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => setEditMode(true)}
                >
                    Edit Profile
                </Button>
            </Card>
        </Box>
    );
}
