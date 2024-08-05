import { Typography, Box, Stack } from '@mui/material';
import config from '../../config';

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
    textAlign: 'center',
    color: 'white',
    overflow: 'hidden',
    rowGap: '3rem',
    position: 'relative',
};

type CreditCardProps = {
    imageSrc?: string;
    name: string;
    role: string;
};

type OrgCreditCardProps = {
    name: string;
    imageSrc?: string;
};

function OrgCreditCard({ name, imageSrc }: OrgCreditCardProps): JSX.Element {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '330px',
                maxWidth: '100%',
                height: '225px',
                textAlign: 'center',
            }}
            m={2}
        >
            {imageSrc && (
                <Box
                    sx={{
                        height: '150px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        marginRight: '1rem',
                        padding: '1rem',
                    }}
                >
                    <img
                        src={`${config.basePath}${imageSrc}`}
                        alt={name}
                        style={{ width: 'auto', maxWidth: '100%', height: '100%' }}
                    />
                </Box>
            )}
        </Box>
    );
}

function CreditCard({ imageSrc, name, role }: CreditCardProps): JSX.Element {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '300px',
                height: '420px',
                textAlign: 'center',
            }}
            m={4}
        >
            <Box width='236px' height='236px'>
                {imageSrc ? (
                    <img
                        src={`${config.basePath}${imageSrc}`}
                        alt={name}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : (
                    <Box
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        fontSize='200px'
                    >🧑‍💻</Box>
                )}
            </Box>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                {name}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {role}
            </Typography>
        </Box>
    );
}

export default function Credits(): JSX.Element {
    return (
        <Box sx={{ ...sectionStyle, background: 'dodgerblue' }} px={{ xs: 1, sm: 1, md: 4 }}>
            <Typography variant='h3'>The Team</Typography>
            <Stack
                direction={{
                    md: 'column-reverse',
                    lg: 'row',
                }}
                alignItems='center'
                justifyContent='center'
            >
                {CreditCard({
                    imageSrc: '/contributors/Mo_Hoque.jpg',
                    name: 'Dr Mo Hoque',
                    role: 'Principal Investigator, University of Portsmouth',
                })}
                {CreditCard({
                    imageSrc: '/contributors/kane.png',
                    name: 'Kane Swartz',
                    role: 'Technical Lead, University of Portsmouth',
                })}
                {CreditCard({
                    imageSrc: '/contributors/Atikul_Islam.jpg',
                    name: 'Atikul Islam',
                    role: 'Researcher, University of Dhaka & University of Portsmouth',
                })}

                {CreditCard({
                    name: 'Fuad Jamali',
                    role: 'Researcher, University of Portsmouth',
                    imageSrc: '/contributors/Fuad_Jamali.jpg',
                })}
            </Stack>

            <Typography variant='h3'>Academic Collaborators</Typography>
            <Stack
                direction={{
                    md: 'column-reverse',
                    lg: 'row',
                }}
                alignItems='center'
                justifyContent='center'
                maxWidth='100%'
                flexWrap='wrap'
            >
                {CreditCard({
                    name: 'Dr Jacek Kopecký',
                    role: 'School of Computing, University of Portsmouth',
                    imageSrc: '/contributors/jacek.jpg',
                })}
                {CreditCard({
                    imageSrc: '/contributors/Jim_Smith.jpg',
                    name: 'Prof Jim Smith',
                    role: 'School of Earth & Environmental Sciences, University of Portsmouth',
                })}
                {CreditCard({
                    imageSrc: '/contributors/Shubhankar_Dam.jpg',
                    name: 'Prof Shubhankar Dam',
                    role: 'School of Law, University of Portsmouth',
                })}
                {CreditCard({
                    imageSrc: '/contributors/Adrian_Butler.jpg',
                    name: 'Prof Adrian Butler',
                    role: 'Department of Civil and Environmental Engineering, Imperial College London',
                })}
                {CreditCard({
                    name: 'Prof Kazi Ahmed',
                    role: 'Department of Geology, University of Dhaka, Bangladesh',
                    imageSrc: '/contributors/Kazi_Matin_Ahmed.jpg',
                })}
            </Stack>

            <Typography variant='h3'>Former Contributors</Typography>
            <Stack
                direction={{
                    md: 'column-reverse',
                    lg: 'row',
                }}
                alignItems='center'
                justifyContent='center'
                maxWidth='100%'
                flexWrap='wrap'
            >
                {CreditCard({
                    name: 'Dr Simon Parker',
                    role: 'Researcher, Imperial College London',
                    imageSrc: '/contributors/Simon_Parker.jpg',
                })}
                {CreditCard({
                    name: "Dillon O'Shea",
                    role: 'Researcher, University of Portsmouth',
                    imageSrc: '/contributors/dillon.webp',
                })}

                {CreditCard({
                    name: 'Lewis Knewton',
                    role: 'Researcher, University of Portsmouth',
                    imageSrc: '/contributors/lewis.webp',
                })}

                {CreditCard({
                    name: 'Nylah Daniella Klasson',
                    role: 'Researcher, University of Portsmouth',
                    imageSrc: '/contributors/nylah.jpg',
                })}

                {CreditCard({
                    name: 'Benjamin Kyd',
                    role: 'Researcher, University of Portsmouth',
                    imageSrc: '/contributors/ben.jpg',
                })}

                {CreditCard({
                    name: 'Fiona Plant',
                    role: 'Researcher, University of Portsmouth',
                })}
            </Stack>
            <Typography variant='h3'>In Partnership With</Typography>
            <Stack
                direction={{
                    md: 'column-reverse',
                    lg: 'row',
                }}
                alignItems='center'
                justifyContent='center'
                maxWidth='100%'
                flexWrap='wrap'
            >
                {OrgCreditCard({
                    name: 'University of Portsmouth',
                    imageSrc: '/contributors/university_of_portsmouth.png',
                })}

                {OrgCreditCard({
                    name: 'Imperial College London ',
                    imageSrc: '/contributors/imperial_college_london.png',
                })}

                {OrgCreditCard({
                    name: 'University of Dhaka',
                    imageSrc: '/contributors/university_of_dhaka.png',
                })}
            </Stack>
        </Box>
    );
}
