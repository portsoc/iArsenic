import { Button, useTheme } from '@mui/material';
import Section from './Section';
import CallToAction from './CallToAction';
import Credits from './Credits';
import { navigate } from 'wouter/use-browser-location';
import { useAccessToken } from '../../utils/useAccessToken';

export default function SplashPage(): JSX.Element {
    const { data: token } = useAccessToken()
    const theme = useTheme();

    function handleTryAppClick() {
        if (token) navigate(`/my-wells`);
        else navigate(`/landing`);
    }

    return (
        <>
            <CallToAction
                tryAppClick={handleTryAppClick}
            />

            <Section
                title='The History'
                texts={[
                    `Groundwater is an attractive source of drinking water particularly
                    in developing countries, as it can be supplied untreated. To avoid
                    waterborne pathogenic diseases, governments and NGOs encouraged
                    installation of millions of tubewells – low-cost mechanical hand-pump
                    wells – in Bangladesh. This has inadvertently exposed around ca.
                    40% consumers to arsenic which is naturally present in the groundwater.
                    Over 20 million Bangladeshi people are exposed to this insidious toxin,
                    resulting in multi-systemic effects including cancer, through the use
                    of ~10 million tubewells. Switching to a safe well has been a major
                    mitigation option for rural inhabitants, but 6 million wells are yet
                    to be tested. Building on existing research, we believe that computer
                    modelling and digital technology can help solve this issue.`
                ]}
                imageConfig={{
                    imageUrl: `/splashPage/well_with_chickens.jpg`,
                    imageSide: 'right',
                    imageAlt: 'Well With Chicken',
                }}
                backgroundColor={theme.palette.primary.dark}
                maxTextWidth='50%'
            />

            <Section
                title='The Research'
                texts={[
                    `Figure 1: The colour of staining on tubewell platform and domestic utensils is an
                    indication of underlying geology and redox condition: (Left panel) Black colouration
                    derives from precipitation manganese oxide in groundwater and indicates that the well
                    is most likely As-free, and (Right panel) Red colouration derives from precipitation
                    of groundwater iron oxide and indicates likely presence of As, particularly if
                    the well is shallow (<100 m below ground level) and located in an arsenic-prone
                    areas. (Photos are shot by the PI in west central Bangladesh).`,
                    `It is widely accepted that iron reduction is the main driver of the release of arsenic
                    into aquifer water. Studies have found that qualitative factors, such as tubewell
                    staining, can indicate subsurface redox condition, geology and water quality. Red
                    staining is associated with iron reduction that may lead to release of As whilst
                    black staining is associated with manganese reduction (any release of As due to manganese
                    reduction is sorbed back on the, yet to be reduced, iron).`,
                ]}
                imageConfig={{
                    imageUrl: `/splashPage/red_vs_black_staining.jpg`,
                    imageSide: 'left',
                    imageAlt: 'Image showing red and black staining on a well platform',
                }}
                backgroundColor='dimgray'
                maxTextWidth='50%'
            />

            <Section
                title='The Solution'
                texts={[
                    `We have reported that the presence or absence of arsenic in a tubewell
                    can be assessed with >90% confidence using: staining of the tubewell
                    platform (a geochemical indicator), the well depth, and street address
                    (producing a 3D location indicator). People living in rural Bangladesh
                    can identify the staining and generally will know the well-depth to sufficient
                    accuracy. We have already utilised these observational indicators and a
                    sample of a public tubewell arsenic-level dataset to develop a computer model.`,
                    `We propose to further extend the model to couple user-derived information
                    (attested platform-staining in new locations) with available datasets.
                    The existing prototype uses a small subset of the available data samples
                    from over 4 million tubewells; in this project we would clean more data,
                    focusing on identified gaps, especially where arsenic is a widespread problem.
                    In effect, the project would provide, for the first time, an instant arsenic
                    level assessment to tubewell owners.`,
                ]}
                imageConfig={{
                    imageUrl: `/splashPage/app_screenshot.png`,
                    imageSide: 'right',
                    imageAlt: 'Screenshot of iArsenic application',
                }}
                backgroundColor='#005a78'
                maxTextWidth='75%'
                imageBorderRadius='15px'
            />

            <Section
                title='Interactive Maps'
                texts={[
                    `See user data appear on an interactive map in real time.`
                ]}
                imageConfig={{
                    imageUrl: `/splashPage/interactive_map.png`,
                    imageSide: 'left',
                    imageAlt: 'Interactive map of Bangladesh',
                }}
                backgroundColor='#1d5e16'
                maxTextWidth='50%'
            />

            <Section
                title='The Bottom Line'
                texts={[
                    `The iArsenic project will enable citizens to assess tubewell water quality
                    without the need for expensive chemical testing kits or any specific training
                    and knowledge.`,
                    `A conservative estimate is that the use of the fully developed
                    application could bring clean water to few million people in a few years by
                    encouraging well-switching. Also, this will help the government to save screening
                    costs, adopt risk-based mitigation strategies for safeguarding health and
                    wellbeing of the rural inhabitants and ultimately, for the country’s increased
                    economic productivity.`
                ]}
                backgroundColor='#1e1e1e'
                maxTextWidth='70%'
                textAlign='center'
                appendage={
                    <Button
                        variant='contained'
                        color='primary'
                        size='large'
                        sx={{ padding: '1rem 2rem', fontSize: '1.2rem' }}
                        onClick={handleTryAppClick}
                    >
                        Try the App
                    </Button>
                }
            />

            <Credits />
        </>
    );
}
