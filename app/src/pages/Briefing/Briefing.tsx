import { Button, Card, Link, List, ListItem, Typography } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import config from "../../config";

export default function Briefing(): JSX.Element {
    return (
        <>
            <Typography className='english' mb='1rem' textAlign='center' variant='h4'>
                Estimate Preparation
            </Typography>

            <Typography className='bengali' mb='1rem' textAlign='center' variant='h4'>
                মূল্যায়ন প্রস্তুতি
            </Typography>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' variant='body1'>
                   To accurately estimate the arsenic levels in your
                   tubewell, we will need the following details from
                   you on the next pages:
                </Typography>

                <Typography className='bengali' variant='body1'>
                    আপনার টিউবওয়েলের আর্সেনিক  ঝুঁকি সঠিকভাবে নির্ধারণ করার জন্য,
                    পরবর্তী পাতাগুলিতে আপনার কাছ থেকে নিম্নলিখিত তথ্যগুলি প্রয়োজন হবে:
                </Typography>

                <List>
                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • <b>Region</b> Select the region where
                            your tubewell is located.
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            • <b>অঞ্চল</b> আপনার টিউবওয়েল যে অঞ্চলে
                            অবস্থিত তা নির্বাচন করুন।
                        </Typography>
                    </ListItem>

                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • <b>Well Depth</b> Enter the depth of
                            your well (in meters or feet).
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            • <b>টিউবওয়েলের গভীরতা</b> আপনার নলকূপের গভীরতা
                            (মিটার বা ফুটে) প্রবেশ করান।
                        </Typography>
                    </ListItem>

                    <ListItem>
                        <Typography className='english' variant='body1'>
                            • <b>Staining Colour</b> Describe any visible staining
                            on the tubewell platform (e.g., red, black, none).
                        </Typography>

                        <Typography className='bengali' variant='body1'>
                            • <b>দাগের রঙ</b> টিউবওয়েল প্ল্যাটফর্মে দৃশ্যমান কোনও দাগ
                            থাকলে তার বর্ণনা (যেমন, লাল, কালো, নেই)।
                        </Typography>
                    </ListItem>
                </List>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb='1rem' textAlign='center' variant='h5'>
                    How It Works
                </Typography>

                <Typography className='bengali' mb='1rem' textAlign='center' variant='h5'>
                    এ্যপটি কিভাবে কাজ করে
                </Typography>

                <Typography className='english' variant='body1'>
                    We combine the region and well depth information to assess
                    the geological conditions, and the staining color to
                    understand chemical properties. These details help
                    us accurately predict arsenic risk in your water.
                </Typography>

                <Typography className='bengali' variant='body1'>
                    আমরা ভূতাত্ত্বিক পরিস্থিতি মূল্যায়ন করতে অঞ্চল এবং নলকূপের গভীরতার
                    তথ্য একত্রিত করি এবং রাসায়নিক বৈশিষ্ট্য বোঝার জন্য প্ল্যাটফর্মে দৃশ্যমান
                    দাগের রঙ ব্যবহার করি। এই তথ্যগুলি আমাদের আপনার টিউবওয়েলের
                    পানির আর্সেনিক ঝুঁকি সঠিকভাবে পূর্বাভাস দিতে সাহায্য করে।
                </Typography>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb='1rem' textAlign='center' variant='h5'>
                    Your Privacy
                </Typography>

                <Typography className='bengali' mb='1rem' textAlign='center' variant='h5'>
                    আপনার তথ্যের গোপনীয়তা
                </Typography>

                <Typography className='english' variant='body1'>
                    Your privacy matters to us. The data we collect is
                    entirely non-personal and anonymous. We use this data
                    solely to improve the accuracy of our estimates.
                    For a detailed explanation of our data
                    practices,&nbsp;
                    <Link
                        onClick={() => navigate(`${config.basePath}/privacy-policy`)}
                        sx={{ cursor: 'pointer' }}
                    >
                        click here
                    </Link>.
                </Typography>

                <Typography className='bengali' variant='body1'>
                    আপনার ব্যক্তিগত তথ্যের গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। আমরা য
                    ে তথ্য সংগ্রহ করি তা সম্পূর্ণ অব্যক্তিগত এবং বেনামি। আমরা শুধুমাত্র
                    আমাদের অনুমানের সঠিকতা উন্নত করার জন্য এই তথ্য ব্যবহার করি।
                    আমাদের ডেটা অনুশীলনগুলির বিশদ ব্যাখ্যার জন্য,
                    <Link
                        onClick={() => navigate(`${config.basePath}/privacy-policy`)}
                        sx={{ cursor: 'pointer' }}
                    >
                        এখানে ক্লিক করুন।
                    </Link>.
                </Typography>
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <Typography className='english' mb='1rem' textAlign='center' variant='h5'>
                    Consent
                </Typography>

                <Typography className='bengali' mb='1rem' textAlign='center' variant='h5'>
                    আপনার সম্মতি
                </Typography>

                <Typography className='english' variant='body1'>
                    By proceeding, you consent to the anonymous storage
                    of your data and acknowledge that the estimates
                    provided are probabilistic and should be used as
                    a guideline only.
                </Typography>

                <Typography className='bengali' variant='body1'>
                    আমাদের এ্যপ ব্যবহার করার মাধ্যমে, আপনি তথ্যের বেনামি
                    সংরক্ষণে সম্মতি প্রদান করছেন এবং স্বীকার করছেন যে আর্সেনিক
                    ঝুঁকি মূল্যায়ন সম্ভাব্যতার ভিত্তিতে তৈরি এবং শুধুমাত্র একটি
                    নির্দেশিকা হিসেবে ব্যবহার করা উচিত। আমাদের উদ্দেশ্য হল
                    আপনাকে একটি সাধারণ ধারণা প্রদান করা, যাতে আপনি
                    পানিয়জল সম্পর্কে  আরও ভালভাবে প্রস্তুতি নিতে পারেন ।
                </Typography>
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                onClick={() => navigate(`${config.basePath}/region`)}
            >
                <Typography className='english'>Generate Estimate</Typography>
                <Typography className='bengali'>ঝুঁকি  মূল্যায়ন করুন</Typography>
            </Button>
        </>
    );
}