import { Button, CircularProgress, Link, List, ListItem } from "@mui/material";
import { navigate } from "wouter/use-browser-location";
import { Well } from "iarsenic-types";
import { useAccessToken } from "../../utils/useAccessToken";
import TranslatableText from "../../components/TranslatableText";
import PageCard from "../../components/PageCard";
import { useState } from "react";

export default function Briefing(): JSX.Element {
    const { data: token } = useAccessToken();
    const [changingPage, setChangingPage] = useState(false)

    async function addWell(): Promise<Well> {
        setChangingPage(true)
        const headers: HeadersInit = {};

        if (token) {
            headers.authorization = `Bearer ${token.id}`;
        }

        const res = await fetch(`/api/v1/self/well`, {
            method: 'POST',
            headers,
        });

        if (!res.ok) {
            throw new Error('Failed to add well');
        }

        const well = await res.json();

        if (!token) {
            const stored = localStorage.getItem("unclaimedWellIds");
            const unclaimed: string[] = stored ? JSON.parse(stored) : [];
            localStorage.setItem("unclaimedWellIds", JSON.stringify([...unclaimed, well.id]));
        }

        setChangingPage(false)
        return well as Well;
    }

    return (
        <>
            <TranslatableText
                english='Estimate Preparation'
                bengali='মূল্যায়ন প্রস্তুতি'
                mb='1rem'
                variant='h4'
                textAlign='center'
            />

            <PageCard>
                <TranslatableText
                    english={`
                        To accurately estimate the arsenic levels in your
                        tubewell, we will need the following details from
                        you on the next pages:
                    `}
                    bengali={`
                        আপনার টিউবওয়েলের আর্সেনিক  ঝুঁকি সঠিকভাবে নির্ধারণ করার জন্য,
                        পরবর্তী পাতাগুলিতে আপনার কাছ থেকে নিম্নলিখিত তথ্যগুলি প্রয়োজন হবে:
                    `}
                    variant='body1'
                />

                <List>
                    <ListItem>

                    <TranslatableText
                        variant="body1"
                        english={
                            <>
                                • <b>Region</b> Select the region where your tubewell is located.
                            </>
                        }
                        bengali={
                            <>
                                • <b>অঞ্চল</b> আপনার টিউবওয়েল যে অঞ্চলে অবস্থিত তা নির্বাচন করুন।
                            </>
                        }
                    />

                    </ListItem>

                    <ListItem>
                        <TranslatableText 
                            variant='body1'
                            english={
                                <>
                                    • <b>Well Depth</b> Enter the depth of
                                    your well (in meters or feet).
                                </>
                            }
                            bengali={
                                <>
                                    • <b>টিউবওয়েলের গভীরতা</b> আপনার নলকূপের গভীরতা
                                    (মিটার বা ফুটে) প্রবেশ করান।
                                </>
                            }
                        />
                    </ListItem>

                    <ListItem>
                        <TranslatableText
                            variant='body1'
                            english={
                                <>
                                    • <b>Staining Colour</b> Describe any visible staining
                                    on the tubewell platform (e.g., red, black, none).
                                </>
                            }
                            bengali={
                                <>
                                    • <b>দাগের রঙ</b> টিউবওয়েল প্ল্যাটফর্মে দৃশ্যমান কোনও দাগ
                                    থাকলে তার বর্ণনা (যেমন, লাল, কালো, নেই)।
                                </>
                            }

                        />
                    </ListItem>
                </List>
            </PageCard>

            <PageCard>
                <TranslatableText 
                    variant='h5' 
                    mb='1rem'
                    textAlign="center"
                    english='How It Works'
                    bengali='এ্যপটি কিভাবে কাজ করে'
                />

                <TranslatableText 
                    variant='body1' 
                    english={`
                        We combine the region and well depth information to assess
                        the geological conditions, and the staining color to
                        understand chemical properties. These details help
                        us accurately predict arsenic risk in your water.
                    `}
                    bengali={`
                        আমরা ভূতাত্ত্বিক পরিস্থিতি মূল্যায়ন করতে অঞ্চল এবং নলকূপের গভীরতার
                        তথ্য একত্রিত করি এবং রাসায়নিক বৈশিষ্ট্য বোঝার জন্য প্ল্যাটফর্মে দৃশ্যমান
                        দাগের রঙ ব্যবহার করি। এই তথ্যগুলি আমাদের আপনার টিউবওয়েলের
                        পানির আর্সেনিক ঝুঁকি সঠিকভাবে পূর্বাভাস দিতে সাহায্য করে।
                    `}
                />
            </PageCard>

            <PageCard>
                <TranslatableText 
                    mb='1rem' 
                    textAlign="center"
                    variant='h5'
                    english='Your Privacy'
                    bengali='আপনার তথ্যের গোপনীয়তা'
                />
                
                <TranslatableText 
                    variant='body1' 
                    english={
                        <>
                            Your privacy matters to us. The data we collect is
                            entirely non-personal and anonymous. We use this data
                            solely to improve the accuracy of our estimates.
                            For a detailed explanation of our data
                            practices,&nbsp;

                            <Link
                                onClick={() => navigate(`/privacy-policy`)}
                                sx={{ cursor: 'pointer' }}
                            >
                                click here
                            </Link>.
                        </>
                    }
                    bengali={
                        <>
                            আপনার ব্যক্তিগত তথ্যের গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। আমরা য
                            ে তথ্য সংগ্রহ করি তা সম্পূর্ণ অব্যক্তিগত এবং বেনামি। আমরা শুধুমাত্র
                            আমাদের অনুমানের সঠিকতা উন্নত করার জন্য এই তথ্য ব্যবহার করি।
                            আমাদের ডেটা অনুশীলনগুলির বিশদ ব্যাখ্যার জন্য,
                            <Link
                                onClick={() => navigate(`/privacy-policy`)}
                                sx={{ cursor: 'pointer' }}
                            >
                                এখানে ক্লিক করুন।
                            </Link>.
                        </>
                    }
                />
            </PageCard>

            <PageCard>
                <TranslatableText 
                    variant='h5' 
                    mb='1rem'
                    textAlign="center"
                    english='Consent'
                    bengali='আপনার সম্মতি'
                />

                <TranslatableText 
                    variant='body1'
                    english={`
                        By proceeding, you consent to the anonymous storage
                        of your data and acknowledge that the estimates
                        provided are probabilistic and should be used as
                        a guideline only.
                    `}
                    bengali={`
                        আমাদের এ্যপ ব্যবহার করার মাধ্যমে, আপনি তথ্যের বেনামি
                        সংরক্ষণে সম্মতি প্রদান করছেন এবং স্বীকার করছেন যে আর্সেনিক
                        ঝুঁকি মূল্যায়ন সম্ভাব্যতার ভিত্তিতে তৈরি এবং শুধুমাত্র একটি
                        নির্দেশিকা হিসেবে ব্যবহার করা উচিত। আমাদের উদ্দেশ্য হল
                        আপনাকে একটি সাধারণ ধারণা প্রদান করা, যাতে আপনি
                        পানিয়জল সম্পর্কে  আরও ভালভাবে প্রস্তুতি নিতে পারেন ।
                    `}
                />
            </PageCard>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'
                disabled={changingPage}
                onClick={async () => {
                    const newWell = await addWell();
                    navigate(`/well/${newWell.id}/region`);
                }}
            >
                {changingPage ?
                    <CircularProgress /> :
                    <TranslatableText 
                        variant='body1'
                        english='Generate Estimate' 
                        bengali='ঝুঁকি  মূল্যায়ন করুন'
                    />
                }
            </Button>
        </>
    );
}