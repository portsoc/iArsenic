import { Box, Stack } from '@mui/material';
import TranslatableText from '../../components/TranslatableText';
import { ReactNode } from 'react';

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

interface TranslatableTextContent {
    english: ReactNode;
    bengali: ReactNode;
}

interface CreditCardProps {
    imageSrc?: string;
    name: TranslatableTextContent;
    role: TranslatableTextContent;
}

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
                        borderRadius: '8px',
                        overflow: 'hidden',
                        padding: '1rem',
                    }}
                >
                    <img
                        src={imageSrc}
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
                        src={imageSrc}
                        alt={typeof name === 'object' ? String(name.english) : name}
                        style={{
                            width: 'auto',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            aspectRatio: '1',
                        }}
                    />
                ) : (
                    <Box
                        style={{ width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                        fontSize='200px'
                    >🧑‍💻</Box>
                )}
            </Box>

            <TranslatableText
                variant="h5"
                english={name.english}
                bengali={name.bengali}
                sx={{ mt: 2, mb: 1 }}
            />

            <TranslatableText
                variant="subtitle1"
                english={role.english}
                bengali={role.bengali}
                sx={{ mb: 1 }}
            />
        </Box>
    );
}

export default function Credits(): JSX.Element {
    return (
        <Box sx={{ ...sectionStyle, background: 'dodgerblue' }} px={{ xs: 1, sm: 1, md: 4 }}>
            <TranslatableText 
                variant='h3'
                english='The Team'
                bengali='টিম সদস্যবৃন্দ'
            /> 
            <Stack
                direction={{
                    md: 'column',
                    lg: 'row',
                }}
                alignItems='center'
                justifyContent='center'
                flexWrap='wrap'
            >

                <CreditCard
                    imageSrc='/contributors/Mo_Hoque.jpg'
                    name={{ english: 'Dr Mo Hoque', bengali: 'ড. মো হক' }}
                    role={{ english: 'Principal Investigator, University of Portsmouth', bengali: 'প্রধান গবেষক ও প্রকল্প পরিচালক, ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />

                <CreditCard
                    imageSrc='/contributors/kane.png'
                    name={{ english: 'Kane Swartz', bengali: 'কেন সোয়ার্টজ' }}
                    role={{ english: 'Technical Lead, University of Portsmouth', bengali: 'প্রযুক্তি প্রধান, ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />

                <CreditCard
                    imageSrc='/contributors/Atikul_Islam.jpg'
                    name={{ english: 'Atikul Islam', bengali: 'আতিকুল ইসলাম' }}
                    role={{ english: 'Researcher, University of Dhaka & University of Portsmouth', bengali: 'গবেষক, ঢাকা বিশ্ববিদ্যালয় ও ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />

                <CreditCard
                    imageSrc='/contributors/Fuad_Jamali.jpg'
                    name={{ english: 'Fuad Jamali', bengali: 'ফুয়াদ জামালি' }}
                    role={{ english: 'Researcher, University of Portsmouth', bengali: 'গবেষক, ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />
            </Stack>

            <TranslatableText 
                variant='h3'
                english='Academic Collaborators'
                bengali='একাডেমিক সহযোগীরা'
            />

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
                <CreditCard
                    imageSrc='/contributors/jacek.jpg'
                    name={{ english: 'Dr Jacek Kopecký', bengali: 'ড. যাসেক কোপেকি' }}
                    role={{ english: 'School of Computing, University of Portsmouth', bengali: 'স্কুল অফ কম্পিউটিং, ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />

                <CreditCard
                    imageSrc='/contributors/Jim_Smith.jpg'
                    name={{ english: 'Prof Jim Smith', bengali: 'প্রফেসর জিম স্মিথ' }}
                    role={{ english: 'School of Earth & Environmental Sciences, University of Portsmouth', bengali: 'ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />
                
                <CreditCard
                    imageSrc='/contributors/Shubhankar_Dam.jpg'
                    name={{ english: 'Prof Shubhankar Dam', bengali: 'প্রফেসর শুভঙ্কর দাম' }}
                    role={{ english: 'School of Law, University of Portsmouth', bengali: 'স্কুল অফ ল’ (আইন), ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />

                <CreditCard
                    imageSrc='/contributors/Adrian_Butler.jpg'
                    name={{ english: 'Prof Adrian Butler', bengali: 'প্রফেসর আদ্রিয়ান বাটলার' }}
                    role={{ english: 'Department of Civil and Environmental Engineering, Imperial College London', bengali: 'সিভিল ও এনভায়রনমেন্টাল ইঞ্জিনিয়ারিং বিভাগ, ইম্পেরিয়াল কলেজ লন্ডন' }}
                />

                <CreditCard
                    imageSrc='/contributors/Kazi_Matin_Ahmed.jpg'
                    name={{ english: 'Prof Kazi Ahmed', bengali: 'প্রফেসর কাজী মতিন আহমেদ' }}
                    role={{ english: 'Department of Geology, University of Dhaka, Bangladesh', bengali: 'ভূতত্ত্ব বিভাগ, ঢাকা বিশ্ববিদ্যালয়, বাংলাদেশ' }}
                />
                
                <CreditCard
                    imageSrc='/contributors/Ashraf_Dewan.png'
                    name={{ english: 'Dr Ashraf Dewan', bengali: 'ড. আশরাফ দেওয়ান' }}
                    role={{ english: 'School of Earth and Planetary Sciences (EPS), Curtin University, Australia', bengali: 'স্কুল অফ আর্থ অ্যান্ড প্লানেটারি সায়েন্সেস, কার্টিন ইউনিভার্সিটি, অস্ট্রেলিয়া' }}
                />
            </Stack>

            <TranslatableText 
                variant='h3'
                english='Former Contributors'
                bengali='সাবেক অবদানকারী'
            />
            <Stack
                direction={{
                    md: 'column',
                    lg: 'row',
                }}
                alignItems='center'
                justifyContent='center'
                maxWidth='100%'
                flexWrap='wrap'
            >
                <CreditCard
                    imageSrc='/contributors/Simon_Parker.jpg'
                    name={{ english: 'Dr Simon Parker', bengali: 'ড. সাইমন পার্কার' }}
                    role={{ english: 'Researcher, Imperial College London', bengali: 'গবেষক, ইম্পেরিয়াল কলেজ লন্ডন' }}
                />

                <CreditCard
                    imageSrc='/contributors/dillon.webp'
                    name={{ english: "Dillon O'Shea", bengali: "ডিলন ও'শি" }}
                    role={{ english: 'Researcher, University of Portsmouth', bengali: 'গবেষক, ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />

                <CreditCard
                    imageSrc='/contributors/lewis.webp'
                    name={{ english: 'Lewis Newton', bengali: 'লুইস নিউটন' }}
                    role={{ english: 'Researcher, University of Portsmouth', bengali: 'গবেষক, ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />

                <CreditCard
                    imageSrc='/contributors/nylah.jpg'
                    name={{ english: 'Nylah Daniella Klasson', bengali: 'নায়লা ড্যানিয়েলা ক্ল্যাসন' }}
                    role={{ english: 'Researcher, University of Portsmouth', bengali: 'গবেষক, ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />

                <CreditCard
                    imageSrc='/contributors/ben.jpg'
                    name={{ english: 'Benjamin Kyd', bengali: 'বেনজামিন কিড' }}
                    role={{ english: 'Researcher, University of Portsmouth', bengali: 'গবেষক, ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />

                <CreditCard
                    name={{ english: 'Fiona Plant', bengali: 'ফিওনা প্ল্যান্ট' }}
                    role={{ english: 'Researcher, University of Portsmouth', bengali: 'গবেষক, ইউনিভার্সিটি অফ পোর্টসমাউথ' }}
                />

            </Stack>

            <TranslatableText 
                variant='h3'
                english='In Partnership With'
                bengali='সহযোগিতার অংশীদার'
            />
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

                {OrgCreditCard({
                    name: 'Department of Public Health Engineering',
                    imageSrc: '/contributors/dphe.png',
                })}

                {OrgCreditCard({
                    name: 'Curtin University',
                    imageSrc: '/contributors/curtin_university.png',
                })}
            </Stack>
        </Box>
    );
}
