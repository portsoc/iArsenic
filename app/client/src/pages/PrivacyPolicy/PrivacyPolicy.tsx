import TranslatableText from "../../components/TranslatableText";
import PageCard from "../../components/PageCard";
import { Button, List, ListItem } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PrivacyPolicy(): JSX.Element {
    return (
        <>
            <TranslatableText 
                width='100%'
                variant='h4' 
                mb='1rem'
                textAlign='center'
                english='Privacy Policy'
                bengali='গোপনীয়তা নীতি'
            />

            <Button
                variant='outlined'
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'start' }}
                onClick={() => window.history.back()}
            >
                <TranslatableText 
                    variant='body1' 
                    textAlign='center'
                    english='Return'
                    bengali='ফিরে যান' // chatgpt generated
                />
            </Button>

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    mb='1rem'
                    textAlign='center'
                    english='Our Data Practices'
                    bengali='আমাদের ডেটা ব্যবস্থাপনা'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Our Commitment'
                    bengali='আমাদের অঙ্গীকার'
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
                    bengali={`
                        iArsenic-এ আমরা আপনার গোপনীয়তা রক্ষা করার জন্য প্রতিশ্রুতিবদ্ধ। এই নীতিতে ব্যাখ্যা করা হয়েছে, আপনি যখন আমাদের অ্যাপ ব্যবহার করেন তখন আপনার দেওয়া তথ্য আমরা কীভাবে ব্যবহার করি। আমাদের লক্ষ্য হলো আপনাকে একটি নিরাপদ এবং বিশ্বাসযোগ্য সেবা দেওয়া, যাতে আপনি আপনার নলকূপে আর্সেনিকের ঝুঁকি বুঝতে পারেন।
                    `}
                />
            </PageCard>

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    textAlign="center"
                    mb='1rem'
                    english='Data Collection'
                    bengali='ডেটা সংগ্রহ'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='What We Collect'
                    bengali='আমরা কী সংগ্রহ করি'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        To estimate arsenic levels, we ask you to input the following details
                    `}
                    bengali='আমরা আপনাকে কিছু তথ্য দিতে বলি—যেমন'
                />

                <List sx={{ mb: '1rem', width: '100%' }}>
                    <ListItem>
                        <TranslatableText
                            variant='body1'
                            english={`
                                • The administrative region of your tubewell
                            `}
                            bengali={`
                                • আপনার নলকূপের অবস্থান (বিভাগ, জেলা ইত্যাদি)
                            `}
                        />
                    </ListItem>

                    <ListItem>
                        <TranslatableText
                            variant='body1'
                            english={`
                                • The depth of the well
                            `}
                            bengali={`
                                • নলকূপের গভীরতা
                            `}
                        />
                    </ListItem>

                    <ListItem>
                        <TranslatableText
                            variant='body1'
                            english={`
                                • The color of any staining on the well platform
                            `}
                            bengali={`
                                • নলকূপের সিমেন্টের মেঝেতে কোনো দাগ আছে কি না এবং কী রঙ
                            `}
                        />
                    </ListItem>
                </List>

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Purpose'
                    bengali='উদ্দেশ্য'
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
                    bengali='এই তথ্যগুলো আমাদেরকে ভূমির রাসায়নিক ও ভূতাত্ত্বিক অবস্থা বুঝতে সাহায্য করে, যা পানি নিরাপদ কি না তা অনুমান করতে কাজে লাগে।'
                />
            </PageCard>

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    textAlign="center"
                    mb='1rem'
                    english='Data Use'
                    bengali='ডেটা ব্যবহার'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Analysis'
                    bengali='বিশ্লেষণ'
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
                    bengali={`
                        আপনার দেওয়া তথ্য ব্যবহার করে আমরা হিসাব করি—আপনার পানিতে আর্সেনিক থাকতে পারে কি না। এটি বৈজ্ঞানিক গবেষণার ভিত্তিতে তৈরি মডেল ও ডেটার মাধ্যমে হয়।
                    `}
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Improvement'
                    bengali='উন্নয়ন'
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
                    bengali={`
                        আমরা নামবিহীন (anonymized) ডেটা ব্যবহার করি অ্যাপ আরও ভালো করার জন্য, যাতে ভবিষ্যতে আপনি ও অন্যরা আরও ভালোভাবে উপকৃত হতে পারেন।
                    `}
                />
            </PageCard>

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    mb='1rem'
                    textAlign="center"
                    english='Data Protection'
                    bengali='ডেটা সুরক্ষা'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Storage'
                    bengali='স্টোরেজ'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    mb='1rem'
                    english={`
                        All data is stored on secure cloud servers, which
                        are protected with the latest encryption technologies.
                    `}
                    bengali={`সব ডেটা নিরাপদ ক্লাউড সার্ভারে রাখা হয় এবং আধুনিক এনক্রিপশন প্রযুক্তি দিয়ে সুরক্ষিত।`}
                />

                <TranslatableText 
                    width='100%'
                    fontWeight='bold' 
                    variant='body1'
                    english='Access'
                    bengali='অ্যাক্সেস'
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
                    bengali={`
                        শুধু নির্ধারিত টিমের সদস্যরা এই ডেটা দেখতে পারে, এবং সেটিও শুধুমাত্র অ্যাপ উন্নয়নের জন্য।
                    `}
                />

                <TranslatableText 
                    width='100%'
                    fontWeight='bold' 
                    variant='body1'
                    english='Anonymity'
                    bengali='গোপনীয়তা'
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
                    bengali={`
                        আমরা আপনার নাম বা ব্যক্তিগত পরিচয় কখনোই সংরক্ষণ করি না। ব্যবহৃত সব ডেটা সম্পূর্ণ নামবিহীন থাকে।
                    `}
                />
            </PageCard>

            <PageCard gap='0'>
                <TranslatableText 
                    width='100%'
                    variant='h5' 
                    mb='1rem'
                    textAlign="center"
                    english='User Consent'
                    bengali='ব্যবহারকারীর সম্মতি'
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Informed Consent'
                    bengali='আপনার সম্মতি'
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
                    bengali={`
                        আপনি যখন আমাদের অ্যাপ ব্যবহার করেন এবং তথ্য দেন, তখন আপনি আমাদের এই ডেটা ব্যবহারে সম্মতি দিচ্ছেন।
                    `}
                />

                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    fontWeight='bold'
                    english='Withdrawal of Consent'
                    bengali='সম্মতি বাতিল'
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
                    bengali={`
                        আপনি চাইলে "Assess Risk" বোতাম প্রেস করার আগে অ্যাপ ব্যবহার বন্ধ করে দিতে পারেন। সেটি হলে আমরা আপনার ডেটা আর ব্যবহার করব না।
                        কিন্তু একবার যদি আপনি "Assess Risk" চাপেন, তখন আপনার ডেটা সঙ্গে সঙ্গে নামবিহীনভাবে সংরক্ষণ হয়ে যায়, এবং সেটি আর চিহ্নিত বা মুছে ফেলা সম্ভব নয়।
                    `}
                />
            </PageCard>
            
            <Button
                sx={{ width: '90%', height: '4rem', marginTop: '2rem'}}
                variant='contained'
                onClick={() => window.history.back()}
            >
                <TranslatableText 
                    width='100%'
                    variant='body1' 
                    english='Return'
                    bengali='ফিরে যান' // chatgpt generated
                />
            </Button>
        </>
    );
}