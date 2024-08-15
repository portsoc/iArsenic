import { Button, Card, Typography } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import config from "../../config";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PrivacyPolicy(): JSX.Element {
    return (
        <>
            <Typography className='english' mb='1rem' textAlign='center' variant='h4'>
                Privacy Policy
            </Typography>

            <Button
                variant='outlined'
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'start' }}
                onClick={() => navigate(`${config.basePath}/briefing`)}
            >
                Return to Estimate Preparation
            </Button>

            <Typography className='bengali' mb='1rem' textAlign='center' variant='h4'>
                PLACEHOLDER BENGALI
            </Typography>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb='1rem' textAlign='center' variant='h5'>
                    Our Data Practices
                </Typography>

                <Typography className='bengali' mb='1rem' textAlign='center' variant='h5'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' variant='body1'>
                    At iArsenic, we are committed to protecting your
                    privacy. This document explains how we handle the
                    data you provide when using our app. Our goal is
                    to provide you with a secure and trustworthy
                    experience while using our service to assess
                    arsenic risk in your tubewell.
                </Typography>

                <Typography className='bengali' variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb='1rem' textAlign='center' variant='h5'>
                    Data Collection
                </Typography>

                <Typography className='bengali' mb='1rem' textAlign='center' variant='h5'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' fontWeight='bold' variant='body1'>
                    What We Collect
                </Typography>

                <Typography className='bengali' fontStyle='bold' variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' mb={2} variant='body1'>
                    To estimate arsenic levels, we ask you to input
                    the following details: the administrative region
                    of your tubewell, the depth of the well, and
                    the color of any staining on the well platform.
                </Typography>

                <Typography className='bengali' mb={2} variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' fontWeight='bold' variant='body1'>
                    Purpose
                </Typography>

                <Typography className='bengali' fontStyle='bold' variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' mb={2} variant='body1'>
                    This information helps us determine geological
                    conditions and chemical properties that are crucial
                    for predicting arsenic contamination levels in your water.
                </Typography>

                <Typography className='bengali' mb={2} variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb='1rem' textAlign='center' variant='h5'>
                    Data Use
                </Typography>

                <Typography className='bengali' mb='1rem' textAlign='center' variant='h5'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' fontWeight='bold' variant='body1'>
                    Analysis
                </Typography>

                <Typography className='bengali' fontStyle='bold' variant='body1'>
                    PLACEHOLDER BEGNALI
                </Typography>

                <Typography className='english' mb={2} variant='body1'>
                    We use the data you provide to calculate the probability
                    of arsenic presence in your groundwater. These
                    calculations are based on aggregated data and scientific
                    models developed through extensive research.
                </Typography>

                <Typography className='bengali' mb={2} variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' fontWeight='bold' variant='body1'>
                    Improvement
                </Typography>

                <Typography className='bengali' fontStyle='bold' variant='body1'>
                    PLACEHOLDER BEGNALI
                </Typography>

                <Typography className='english' mb={2} variant='body1'>
                    We also use anonymized data to enhance the app’s
                    functionality and predictive accuracy. This ongoing
                    improvement helps us serve you and others better.
                </Typography>

                <Typography className='bengali' mb={2} variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb='1rem' textAlign='center' variant='h5'>
                    Data Protection
                </Typography>

                <Typography className='bengali' mb='1rem' textAlign='center' variant='h5'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' fontWeight='bold' variant='body1'>
                    Storage
                </Typography>

                <Typography className='bengali' fontStyle='bold' variant='body1'>
                    PLACEHOLDER BEGNALI
                </Typography>

                <Typography className='english' mb={2} variant='body1'>
                    All data is stored on secure cloud servers, which
                    are protected with the latest encryption technologies.
                </Typography>

                <Typography className='bengali' mb={2} variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' fontWeight='bold' variant='body1'>
                    Access
                </Typography>

                <Typography className='bengali' fontStyle='bold' variant='body1'>
                    PLACEHOLDER BEGNALI
                </Typography>

                <Typography className='english' mb={2} variant='body1'>
                    Access to this data is strictly controlled. Only
                    authorized personnel have access to raw data,
                    and only for purposes of improving the app and
                    its algorithms.
                </Typography>

                <Typography className='bengali' mb={2} variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' fontWeight='bold' variant='body1'>
                    Anonymity
                </Typography>

                <Typography className='bengali' fontStyle='bold' variant='body1'>
                    PLACEHOLDER BEGNALI
                </Typography>

                <Typography className='english' mb={2} variant='body1'>
                    We ensure that all data used for analysis remains
                    anonymous. We do not store personal identifiers
                    or any information that could be used to trace
                    data back to an individual.
                </Typography>

                <Typography className='bengali' mb={2} variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb='1rem' textAlign='center' variant='h5'>
                    User Consent
                </Typography>

                <Typography className='bengali' mb='1rem' textAlign='center' variant='h5'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' fontWeight='bold' variant='body1'>
                    Informed Consent
                </Typography>

                <Typography className='bengali' fontStyle='bold' variant='body1'>
                    PLACEHOLDER BEGNALI
                </Typography>

                <Typography className='english' mb={2} variant='body1'>
                    By using our app and providing the requested
                    information, you consent to our use of your
                    anonymized data as described above.
                </Typography>

                <Typography className='bengali' mb={2} variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>

                <Typography className='english' fontWeight='bold' variant='body1'>
                    Withdrawal of Consent
                </Typography>

                <Typography className='bengali' fontStyle='bold' variant='body1'>
                    PLACEHOLDER BEGNALI
                </Typography>

                <Typography className='english' mb={2} variant='body1'>
                    You have the freedom to stop using our app at
                    any time before pressing the "Assess Risk"
                    button, which effectively withdraws your consent
                    for any future data use. However, once you press
                    "Assess Risk" and the assessment is produced, the
                    data you provided is immediately anonymized and
                    stored. Due to this anonymization process, it is
                    not possible to retract or identify your data
                    afterwards. Thus, withdrawal of consent is not
                    feasible for data that has already been used to
                    generate assessments.
                </Typography>

                <Typography className='bengali' mb={2} variant='body1'>
                    PLACEHOLDER BENGALI
                </Typography>
            </Card>
        </>
    );
}