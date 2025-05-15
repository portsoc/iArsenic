import TranslatableText from "../../components/TranslatableText";
import PageCard from "../../components/PageCard";

export default function PrivacyPolicy(): JSX.Element {
    return (
        <>
            <TranslatableText 
                width='100%'
                variant='h4' 
                mb='1rem'
                textAlign='center'
                english='Privacy Policy'
                bengali='BENGALI PLACEHOLDER'
            />

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    mb='1rem'
                    textAlign='center'
                    english='Our Data Practices'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Our Commitment'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        At iArsenic, we are committed to protecting your
                        privacy. This document explains how we handle the
                        data you provide when using our app. Our goal is
                        to provide you with a secure and trustworthy
                        experience while using our service to assess
                        arsenic risk in your tubewell.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />
            </PageCard>

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    textAlign="center"
                    mb='1rem'
                    english='Data Collection'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What We Collect'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        To estimate arsenic levels, we ask you to input
                        the following details: the administrative region
                        of your tubewell, the depth of the well, and
                        the color of any staining on the well platform.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Purpose'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        This information helps us determine geological
                        conditions and chemical properties that are crucial
                        for predicting arsenic contamination levels in your water.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />
            </PageCard>

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    textAlign="center"
                    mb='1rem'
                    english='Data Use'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Analysis'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    english={`
                        We use the data you provide to calculate the probability
                        of arsenic presence in your groundwater. These
                        calculations are based on aggregated data and scientific
                        models developed through extensive research.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Improvement'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        We also use anonymized data to enhance the app’s
                        functionality and predictive accuracy. This ongoing
                        improvement helps us serve you and others better.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />
            </PageCard>

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    mb='1rem'
                    textAlign="center"
                    english='Data Protection'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Storage'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        All data is stored on secure cloud servers, which
                        are protected with the latest encryption technologies.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    fontWeight='bold' 
                    variant='body1'
                    english='Access'
                    bengali='PLACEHOLDER BEGNALI'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        Access to this data is strictly controlled. Only
                        authorized personnel have access to raw data,
                        and only for purposes of improving the app and
                        its algorithms.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    fontWeight='bold' 
                    variant='body1'
                    english='Anonymity'
                    bengali='PLACEHOLDER BEGNALI'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        We ensure that all data used for analysis remains
                        anonymous. We do not store personal identifiers
                        or any information that could be used to trace
                        data back to an individual.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />
            </PageCard>

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    mb='1rem'
                    textAlign="center"
                    english='User Consent'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Informed Consent'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        By using our app and providing the requested
                        information, you consent to our use of your
                        anonymized data as described above.
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Withdrawal of Consent'
                    bengali='BENGALI PLACEHOLDER'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
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
                    `}
                    bengali='BENGALI PLACEHOLDER'
                />
            </PageCard>
        </>
    );
}