import { Button, List, ListItem } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";
import config from '../../config'

export default function Landing(): JSX.Element {
    return (
        <>
            <TranslatableText
                mb='1rem'
                textAlign='center'
                variant='h4'
                english='Welcome to iArsenic'
                bengali='আইআর্সেনিকে আপনাকে স্বাগতম'
            />

            {config.env === 'staging' && (
                <PageCard sx={{ outline: '1px solid red' }}>
                    <TranslatableText
                        mb='1rem'
                        textAlign='center'
                        variant='h6'
                        english='WARNING'
                        bengali='⚠️ সতর্কবার্তা'
                    />

                    <TranslatableText
                        mb='1rem'
                        variant='body1'
                        english={
                            <>
                                This is a research release which is <b>not ready or approved
                                for use in the field.</b>
                            </>
                        }
                        bengali={`
                            এটি একটি গবেষণা পর্যায়ের ভার্সন, যা এখনো মাঠপর্যায়ে ব্যবহারের জন্য প্রস্তুত নয়।
                            অনুগ্রহ করে এটি শুধুমাত্র পরীক্ষা কিংবা অভিজ্ঞতা অর্জনের জন্য ব্যবহারের করুন।
                        `}
                    />
                </PageCard>
            )}

            <PageCard>
                <TranslatableText
                    variant='body1'
                    english={`
                        Powered by cutting-edge research to bring
                        safety to your doorstep.
                        Get started today to help assess 
                        the safety of your drinking water.
                    `}
                    bengali={`
                        আপনার পানিয়জলের নিরাপত্তা  সম্পর্কে  তথ্য দিতে সর্বাধুনিক গবেষণা দ্বারা
                        চালিত। আপনি এবং আপনার পরিবার নিরাপদ পানি পান করছে কিনা তা
                        জানতে আজই শুরু করুন ।
                    `}
                />
            </PageCard>

            <PageCard>
                <TranslatableText
                    mb='1rem'
                    variant='h6'
                    english='Proceed with an Account'
                    bengali='অ্যাকাউন্ট দিয়ে এগিয়ে যান' // chatgpt generated
                />

                <TranslatableText
                    mb='1rem'
                    variant='body1'
                    english='Access your personalized dashboard and save your data'
                    bengali='আপনার ব্যক্তিগত ড্যাশবোর্ডে প্রবেশ করুন এবং আপনার ডেটা সংরক্ষণ করুন' // chatgpt generated
                />

                <Button
                    sx={{ width: '90%', height: '4rem' }}
                    variant='contained'
                    onClick={() => navigate(`/login`)}
                >
                    <TranslatableText
                        variant='body1'
                        english='Login or Sign Up'
                        bengali='লগইন বা সাইন আপ করুন'
                    />
                </Button>
            </PageCard>

            <PageCard>
                <TranslatableText
                    variant='h6'
                    textAlign='center'
                    mb='1rem'
                    english='Express Assesment'
                    bengali='দ্রুত মূল্যায়ন' // chatgpt generated
                />

                <TranslatableText
                    variant='body1'
                    mb='1rem'
                    english={`
                        Protect your health with a few clicks.
                        iArsenic helps you assess the safety of your
                        drinking water by estimating arsenic levels
                        in tubewells across Bangladesh. Simply enter
                        a few details about your tubewell, and let
                        iArsenic do the rest.
                    `}
                    bengali={`
                        কয়েকটি ক্লিকের মাধ্যমে আপনার স্বাস্থ্যের সুরক্ষা করুন। আইআর্সেনিক
                        আপনাকে বাংলাদেশের টিউবওয়েলগুলির আর্সেনিক স্তরের মূল্যায়ন
                        করতে সাহায্য করে। আপনার টিউবওয়েল সম্পর্কে কিছু তথ্য প্রদান
                        করুন এবং বাকিটা আইআর্সেনিকের উপর ছেড়ে দিন।
                    `}
                />

                <List>
                    <ListItem>
                        <TranslatableText
                            variant='body1'
                            english={`
                                • Receive immediate arsenic risk assessments
                                based on tubewell information.
                            `}
                            bengali={`
                                • টিউবওয়েলের তথ্যের উপর ভিত্তি করে তাত্ক্ষণিক আর্সেনিক ঝুঁকি মূল্যায়ন।
                            `}
                        />
                    </ListItem>

                    <ListItem>
                        <TranslatableText
                            variant='body1'
                            english={`
                                • No technical expertise required —just provide
                                simple details about your tubewell.
                            `}
                            bengali={`
                                • কোনও প্রযুক্তিগত জ্ঞান প্রয়োজন নেই—শুধু আপনার টিউবওয়েল
                                সম্পর্কে  সহজ কিছু তথ্য সরবরাহ করুন।
                            `}
                        />
                    </ListItem>

                    <ListItem>
                        <TranslatableText
                            variant='body1'
                            english={`
                                • Your privacy is protected; all data is
                                anonymous and secure.
                            `}
                            bengali={`
                                • কোনও ব্যক্তিগত তথ্য সংগ্রহ করা হয় না - সমস্ত তথ্য
                                বেনামি এবং নিরাপদ।
                            `}
                        />
                    </ListItem>

                    <ListItem>
                        <TranslatableText
                            variant='body1'
                            english={`
                                Using this app is entirely voluntary. 
                                You decide if and when to start your assessment.
                            `}
                            bengali={`
                                এই অ্যাপটি ব্যবহার আপনার ইচ্ছানির্ভর । আপনি চাইলে 
                                আর্সেনিকের মাত্রা মূল্যায়ন শুরু করতে পারেন।
                            `}
                        />
                    </ListItem>
                </List>
            </PageCard>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => navigate(`/briefing`)}
            >
                <TranslatableText
                    variant='body1'
                    english='Start Your Assesment'
                    bengali='আপনার মূল্যায়ন শুরু করুন'
                />
            </Button>
        </>
    );
}