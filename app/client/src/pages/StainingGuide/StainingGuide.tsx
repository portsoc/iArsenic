import { Box, Button, Card } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TranslatableText from "../../components/TranslatableText";

export default function StainingGuide(): JSX.Element {
    return (
        <>
            <TranslatableText 
                variant='h4'
                english='Staining Guide'
                bengali='দাগ নির্দেশিকা'
            />

            <Button
                variant='outlined'
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'start' }}
                onClick={() => window.history.back()}
            >
                <TranslatableText 
                    variant='body1'
                    english='Return'
                    bengali='ফিরে যান'
                />
            </Button>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <TranslatableText 
                    mb='1rem'
                    textAlign='center' 
                    variant='h5'
                    english='Guidelines'
                    bengali='নির্দেশিকা'
                />

                <TranslatableText 
                    variant='body1'
                    english={`
                        The staining on a tube well platform and/or
                        domestic utensils is an indication of
                        the underlying geology and redox condition.
                        This guide describes the differences between
                        red and black staining to assist you in
                        identifying any staining on a given tube well.
                    `}
                    bengali={`
                        নলকূপের পাকা মেঝেতে  অথবা গৃহস্থালির ব্যবহার্য জিনিসে বিশেষত পানির বালতি কিংবা বদনাতে দেখা যাওয়া দাগ ভূগর্ভস্থ রিডক্স (জারণ-বিজারণ) অবস্থার একটি ইঙ্গিত করে। এই নির্দেশিকাটি নলকূপের পাকা মেঝেতে  লাল ও কালো দাগের পার্থক্য ব্যাখ্যা করে, যাতে আপনি একটি নির্দিষ্ট নলকূপে কোনো ধরনের দাগ পড়েছে তা সনাক্ত করতে পারেন।
                    `}
                />
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <TranslatableText 
                    mb='1rem'
                    textAlign='center' 
                    variant='h5'
                    english='Red Staining'
                    bengali='লাল দাগ'
                />

                <TranslatableText 
                    mb='1rem'
                    variant='body1'
                    english={`
                        Red staining is associated with iron reduction
                        that may lead to the release of arsenic and
                        will likely indicate unsafe drinking-water,
                        particularly for shallow wells.
                    `}
                    bengali={`
                        নলকূপের পাকা মেঝের  লাল দাগ সাধারণত লৌহ অক্সাইডের  বিজারণ প্রক্রিয়ার সাথে সম্পর্কিত, যা ভূগর্ভে মাটি থেকে আর্সেনিক মুক্ত হয়ে পানিতে দ্রবীভূত হওয়ার ইঙ্গিত প্রদান করে। লৌহ অক্সাইডের  বিজারণের কারনে পানিতে থাকা লৌহ নলকূপের পানি পাকা মেঝের  যেখানে ছিটকে পড়ে সেখানে  বাতাসের অক্সিজেনের সাথে মিশে পাকা সিমেন্টের মেঝেতে  লাল বা লালচে থেকে হলদে দাগ তৈরি করে। এটি বিশেষ করে অগভীর নলকূপের অনিরাপদ পানির ইঙ্গিত দিতে পারে।    
                    `}
                />

                <Box mb={1}>
                    <img width='100%' src={`/red_platform_1.jpg`}></img>
                </Box>

                <TranslatableText
                    variant='body1'
                    textAlign='center'
                    fontStyle='italic'
                    english='Example of a tube well platform with red staining'
                    bengali='একটি লাল দাগযুক্ত নলকূপের পাকা মেঝের উদাহরণ'
                />
            </Card>

            <Card variant='outlined' sx={{ margin: '0 1rem 1rem 1rem', padding: '1rem'}}>
                <TranslatableText
                    mb='1rem' 
                    textAlign='center' 
                    variant='h5'
                    english='Black Staining'
                    bengali='কালো দাগ'
                />

                <TranslatableText
                    variant='body1'
                    mb='1rem'
                    english={`
                        Black staining is associated with manganese reduction
                        and will likely indicate safe drinking-water; any
                        arsenic released due to manganese reduction will
                        be absorbed back into the unreduced iron.
                    `}
                    bengali={`
                        নলকূপের পাকা মেঝের  কালো দাগ সাধারণত ম্যাঙ্গানিজ অক্সাইডের  বিজারণ প্রক্রিয়ার সাথে সম্পর্কিত । ম্যাঙ্গানিজ বিজারণের ফলে যদি মাটি থেকে আর্সেনিক মুক্ত হয় তা অবিজারিত লৌহের অক্সাইডের উপর পুনরায় আবদ্ধ হয়ে যেতে পারে। এতে  করে যেখানে পানি পড়ে ছিটকে ছড়ায়, ম্যাঙ্গানিজ বাতাসের অক্সিজেনের সাথে মিশে সেই পাকা সিমেন্টের মেঝেতে কালো দাগ তৈরি করে। এটি নিরাপদ পানির ইঙ্গিত দিতে পারে।
                    `}
                />

                <Box mb={1}>
                    <img width='100%' src={`/black_platform_1.jpg`}></img>
                </Box>

                <TranslatableText
                    variant='body1'
                    textAlign='center'
                    fontStyle='italic'
                    english='Example of a tube well platform with black staining'
                    bengali='একটি কালো দাগযুক্ত নলকূপের পাকা মেঝের উদাহরণ'
                />
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem', marginTop: '2rem'}}
                variant='contained'
                onClick={() => window.history.back()}
            >
                <TranslatableText
                    variant='body1'
                    textAlign='center'
                    fontStyle='italic'
                    english='Return'
                    bengali='ফিরে যান'
                />
            </Button>
        </>
    );
}
