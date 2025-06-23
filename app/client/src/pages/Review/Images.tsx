import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Well } from "iarsenic-types";
import { navigate } from "wouter/use-browser-location";
import { useAccessToken } from "../../utils/useAccessToken";
import PageCard from "../../components/PageCard";
import TranslatableText from "../../components/TranslatableText";

interface Props {
    well: Well;
}

export default function WellImageDisplay({ well }: Props) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: token } = useAccessToken()

    useEffect(() => {
        async function fetchSignedUrls() {
            setLoading(true);

            try {
                const headers: HeadersInit = {};

                if (token) {
                    headers["Authorization"] = `Bearer ${token.id}`;
                }

                const paths = well.imagePaths ?? [];

                if (paths.length === 0) {
                    setImageUrls([]);
                    return;
                }

                const res = await fetch(`/api/v1/self/well/${well.id}/signed-image-urls`, {
                    method: "POST",
                    headers: {
                        ...headers,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ paths }),
                });

                if (!res.ok) {
                    const text = await res.text();
                    console.error("Failed to fetch signed URLs:", text);
                    return;
                }

                const { urls } = await res.json();
                setImageUrls(urls);
            } finally {
                setLoading(false);
            }
        }

        fetchSignedUrls();
    }, [well]);

    return (
        <PageCard>
            <Stack width='100%'>
                <TranslatableText 
                    variant="h6" 
                    gutterBottom
                    english='Uploaded Images'
                    bengali='PLACEHOLDER BENGALI'
                />

                <Box
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight={300}
                >
                    {loading ? (
                        <CircularProgress />
                    ) : imageUrls.length > 0 ? (
                        <Carousel
                            showThumbs={false}
                            showStatus={false}
                            emulateTouch
                            dynamicHeight
                        >
                            {imageUrls.map((url, index) => (
                                <div key={index}>
                                    <img
                                        src={url}
                                        alt={`Well image ${index + 1}`}
                                        style={{ maxHeight: 300, objectFit: "cover" }}
                                    />
                                </div>
                            ))}
                        </Carousel>
                    ) : (
                        <TranslatableText 
                            color="text.secondary"
                            english='No images uploaded.'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    )}
                </Box>

                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        sx={{ width: '80%', height: '3rem' }}
                        variant="outlined"
                        onClick={() => {
                            navigate(`/well/${well.id}/upload-image?returnToReview=true`);
                        }}
                    >
                        <TranslatableText 
                            english='Edit Images'
                            bengali='BENGALI PLACEHOLDER'
                        />
                    </Button>
                </Box>
            </Stack>
        </PageCard>
    );
}
