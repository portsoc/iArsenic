import { useEffect, useState } from "react";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Well } from "iarsenic-types";
import AccessTokenRepo from "../../utils/AccessTokenRepo";
import { navigate } from "wouter/use-browser-location";

interface Props {
    well: Well;
}

export default function WellImageDisplay({ well }: Props) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSignedUrls() {
            setLoading(true);

            try {
                const token = await AccessTokenRepo.get();
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
        <Card
            variant="outlined"
            sx={{
                width: "100%",
                padding: "16px",
                marginBottom: "16px",
            }}
        >
            <Typography variant="h6" gutterBottom>
                Uploaded Images
            </Typography>

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
                    <Typography color="text.secondary">
                        No images uploaded.
                    </Typography>
                )}
            </Box>

            <Box display="flex" justifyContent="center" mt={2}>
                <Button
                    sx={{ width: '80%', height: '3rem' }}
                    variant="outlined"
                    onClick={() => {
                        navigate(`/well/${well.id}/upload-image`);
                    }}
                >
                    Edit Images
                </Button>
            </Box>
        </Card>
    );
}
