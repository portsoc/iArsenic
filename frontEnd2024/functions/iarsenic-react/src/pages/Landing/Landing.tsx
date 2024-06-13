import { Button, Card, List, ListItem, Typography } from "@mui/material";
import config from "../../config";
import { navigate } from "wouter/use-browser-location";

export default function Landing(): JSX.Element {
    return (
        <>
            <Typography mb='1rem' textAlign='center' variant='h4' className='english'>
                Welcome to iArsenic
            </Typography>

            <Typography mb='1rem' textAlign='center' variant='h4' className='bengali'>
                আইআর্সেনিকে আপনাকে স্বাগতম
            </Typography>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography mb={2} variant='body1' className='english'>
                    Protect your health with a few clicks.
                    iArsenic helps you assess the safety of your
                    drinking water by estimating arsenic levels
                    in tubewells across Bangladesh. Simply enter
                    a few details about your tubewell, and let
                    iArsenic do the rest.
                </Typography>

                <Typography mb={2} variant='body1' className='bengali'>
                    কয়েকটি ক্লিকের মাধ্যমে আপনার স্বাস্থ্যের সুরক্ষা করুন। আইআর্সেনিক
                    আপনাকে বাংলাদেশের টিউবওয়েলগুলির আর্সেনিক স্তরের মূল্যায়ন
                    করতে সাহায্য করে। আপনার টিউবওয়েল সম্পর্কে কিছু তথ্য প্রদান
                    করুন এবং বাকিটা আইআর্সেনিকের উপর ছেড়ে দিন।
                </Typography>

                <List>
                    <ListItem>
                        <Typography variant='body1' className='english'>
                            • Receive immediate arsenic risk assessments
                            based on tubewell information.
                        </Typography>

                        <Typography variant='body1' className='bengali'>
                            • টিউবওয়েলের তথ্যের উপর ভিত্তি করে তাত্ক্ষণিক আর্সেনিক ঝুঁকি মূল্যায়ন।
                        </Typography>
                    </ListItem>

                    <ListItem>
                        <Typography variant='body1' className='english'>
                            • No technical expertise required —just provide
                            simple details about your tubewell.
                        </Typography>

                        <Typography variant='body1' className='bengali'>
                            • কোনও প্রযুক্তিগত জ্ঞান প্রয়োজন নেই—শুধু আপনার টিউবওয়েল
                            সম্পর্কে  সহজ কিছু তথ্য সরবরাহ করুন।
                        </Typography>
                    </ListItem>

                    <ListItem>
                        <Typography variant='body1' className='english'>
                            • Your privacy is protected; all data is
                            anonymous and secure.
                        </Typography>

                        <Typography variant='body1' className='bengali'>
                            • কোনও ব্যক্তিগত তথ্য সংগ্রহ করা হয় না - সমস্ত তথ্য
                            বেনামি এবং নিরাপদ।
                        </Typography>
                    </ListItem>
                </List>
            </Card>

            <Card variant='outlined' sx={{ margin: '1 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography variant='body1' className='english'>
                    Powered by cutting-edge research to bring
                    safety to your doorstep.
                    Get started today to ensure the water
                    you and your family drink is safe.
                </Typography>

                <Typography variant='body1' className='bengali'>
                    আপনার পানিয়জলের নিরাপত্তা  সম্পর্কে  তথ্য দিতে সর্বাধুনিক গবেষণা দ্বারা
                    চালিত। আপনি এবং আপনার পরিবার নিরাপদ পানি পান করছে কিনা তা
                    জানতে আজই শুরু করুন ।
                </Typography>
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => navigate(`${config.basePath}/briefing`)}
            >
                <Typography className='english'>Start Your Assesment</Typography>
                <Typography className='bengali'>আপনার মূল্যায়ন শুরু করুন</Typography>
            </Button>
        </>
    );
}