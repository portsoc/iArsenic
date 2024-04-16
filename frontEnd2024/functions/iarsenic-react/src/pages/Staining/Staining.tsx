import { Collapse, Box, Button, Card, FormControl, FormControlLabel, MobileStepper, Radio, RadioGroup, Typography } from "@mui/material";
import config from "../../config";
import { navigate } from "wouter/use-browser-location";
import { useState } from "react";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SwipeableViews from 'react-swipeable-views-react-18-fix';

const images = [
    {
        heading: 'Red Staining',
        body: 'Red staining is associated with iron reduction that may lead to the release of arsenic and will likely indicate unsafe drinking-water, particularly for shallow wells.',
        imgPath: `${config.basePath}/red_platform_1.jpg`,
    },
    {
        heading: 'Black Staining',
        body: 'Black staining is associated with manganese reduction and will likely indicate safe drinking-water; any arsenic released due to manganese reduction will be absorbed back into the unreduced iron.',
        imgPath: `${config.basePath}/black_platform_1.jpg`,
    },
];

export default function Staining(): JSX.Element {
    const [activeStep, setActiveStep] = useState(0);
    const [wellStaining, setWellStaining] = useState<'Red' | 'Black' | 'not-sure'>()
    const [utensilStaining, setUtensilStaining] = useState<'Red' | 'Black' | 'not-sure'>()
    const maxSteps = images.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <>
            <Typography marginBottom='1rem' textAlign='center' variant='h4'>Staining</Typography>
            <Card raised variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography textAlign='center' marginBottom='1rem' variant='h5'>
                    Staining Guide
                </Typography>
                <Typography sx={{ marginBottom: '2rem'}} variant='body1'>
                    The staining on a tube well platform and/or domestic utensils is an indication of the underlying geology and redox condition. This guide describes the differences between red and black staining to assist you in identifying any staining on a given tube well.
                </Typography>

                <SwipeableViews
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                >
                    {images.map((step, index) => (
                        <div key={step.heading}>
                            <Typography textAlign='center' marginBottom='1rem' variant='h6'>
                                {step.heading}
                            </Typography>
                            <Typography height='7rem' marginBottom='1rem' variant='body1'>
                                {step.body}
                            </Typography>
                            {Math.abs(activeStep - index) <= 2 ? (
                                <Box
                                    component="img"
                                    sx={{
                                        display: 'block',
                                        maxWidth: 400,
                                        overflow: 'hidden',
                                        width: '100%',
                                        margin: '0 auto',
                                    }}
                                    src={step.imgPath}
                                    alt={`example of ${step.heading}`}
                                />
                            ) : null}
                        </div>
                    ))}
                </SwipeableViews>

                <MobileStepper
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                        <Button
                            size="small"
                            onClick={handleNext}
                            disabled={activeStep === maxSteps - 1}
                        >
                            Next
                            <KeyboardArrowRight />
                        </Button>
                    }
                    backButton={
                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                            <KeyboardArrowLeft />
                            Back
                        </Button>
                    }
                />
            </Card>

            <Card raised variant='outlined' sx={{ width: '100%', margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography marginBottom='1rem' textAlign='center' variant='h5'>
                    Is There Staining On The Platform?
                </Typography>

                <FormControl>
                    <RadioGroup
                        onChange={(event) => {
                            setWellStaining(event.target.value as 'Red' | 'Black' | 'not-sure')
                        }}
                        name="staining-selector"
                    >
                        <FormControlLabel value="Red" control={<Radio />} label="Red" />
                        <FormControlLabel value="Black" control={<Radio />} label="Black" />
                        <FormControlLabel value="not-sure" control={<Radio />} label="Mixed or Unsure" />
                    </RadioGroup>
                </FormControl>

                <Collapse in={wellStaining === 'not-sure'}>
                    <Typography variant="h5" textAlign='center' style={{ marginTop: '1rem' }}>
                        Is there staining on your utensil?
                    </Typography>
                    <RadioGroup
                        onChange={(event) => {
                            setUtensilStaining(event.target.value as 'Red' | 'Black' | 'not-sure')
                        }}
                        name="staining-selector"
                    >
                        <FormControlLabel value="Red" control={<Radio />} label="Red" />
                        <FormControlLabel value="Black" control={<Radio />} label="No colour change to slightly blackish" />
                        <FormControlLabel value="not-sure" control={<Radio />} label="No color" />
                    </RadioGroup>
                </Collapse>
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => {
                    if (!wellStaining) {
                        alert('Please select a staining type for the well platform');
                        return;
                    }

                    if (wellStaining === 'not-sure' && !utensilStaining) {
                        alert('Please select a staining type for the utensil');
                        return;
                    }

                    if (wellStaining === 'not-sure' && utensilStaining === 'not-sure') {
                        alert('Please select a staining type for the utensil');
                        return;
                    }

                    localStorage.setItem('staining', JSON.stringify({
                        well: wellStaining,
                        utensil: utensilStaining,
                    }));

                    navigate(`${config.basePath}/depth`)
                }}
            >
                Next Step
            </Button>
        </>
    );
}
